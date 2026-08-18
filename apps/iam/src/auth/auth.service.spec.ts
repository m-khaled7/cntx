import { status } from '@grpc/grpc-js';
import { RpcError } from '../common/errors/rpc.error.js';
import { User } from '../user/entites/users.entity.js';
import { UsersService } from '../user/user.service.js';
import { AuthSecurity } from './auth.security.js';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';

type MockUsersService = jest.Mocked<
    Pick<UsersService, 'create' | 'findByEmail' | 'setRefreshToken'>
>;

type MockAuthSecurity = jest.Mocked<
    Pick<
        AuthSecurity,
        | 'createTokens'
        | 'hashPassword'
        | 'hashRefreshToken'
        | 'passwordMatches'
        | 'refreshTokenMatches'
        | 'validateAccess'
        | 'validateRefresh'
    >
>;

describe(AuthService.name, () => {
    let service: AuthService;
    let users: MockUsersService;
    let authSecurity: MockAuthSecurity;

    const user: User = {
        id: 'user-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        passwordHash: 'password-hash',
        refreshTokenHash: 'stored-refresh-hash',
    };

    const registerDto: RegisterDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
    };

    beforeEach(() => {
        users = {
            create: jest.fn(),
            findByEmail: jest.fn(),
            setRefreshToken: jest.fn(),
        };

        authSecurity = {
            createTokens: jest.fn(),
            hashPassword: jest.fn(),
            hashRefreshToken: jest.fn(),
            passwordMatches: jest.fn(),
            refreshTokenMatches: jest.fn(),
            validateAccess: jest.fn(),
            validateRefresh: jest.fn(),
        };

        service = new AuthService(
            users as unknown as UsersService,
            authSecurity as unknown as AuthSecurity,
        );
    });

    it('registers a new user and persists the refresh token hash', async () => {
        users.findByEmail.mockResolvedValue(null);
        users.create.mockResolvedValue(user);
        users.setRefreshToken.mockResolvedValue(undefined);
        authSecurity.hashPassword.mockResolvedValue('password-hash');
        authSecurity.createTokens.mockResolvedValue({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        authSecurity.hashRefreshToken.mockResolvedValue('new-refresh-hash');

        await expect(service.register(registerDto)).resolves.toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        expect(users.create).toHaveBeenCalledWith({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            passwordHash: 'password-hash',
        });
        expect(users.setRefreshToken).toHaveBeenCalledWith('user-id', 'new-refresh-hash');
    });

    it('rejects registration when password confirmation does not match', async () => {
        await expectRpcError(
            service.register({ ...registerDto, confirmPassword: 'different' }),
            status.INVALID_ARGUMENT,
            'Confirm password mismatch password.',
        );
        expect(users.create).not.toHaveBeenCalled();
    });

    it('logs in with matching credentials and rotates the refresh token hash', async () => {
        users.findByEmail.mockResolvedValue(user);
        users.setRefreshToken.mockResolvedValue(undefined);
        authSecurity.passwordMatches.mockResolvedValue(true);
        authSecurity.createTokens.mockResolvedValue({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        authSecurity.hashRefreshToken.mockResolvedValue('new-refresh-hash');

        await expect(
            service.login({ email: 'test@example.com', password: 'Password1!' }),
        ).resolves.toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        expect(users.findByEmail).toHaveBeenCalledWith('test@example.com', true);
        expect(users.setRefreshToken).toHaveBeenCalledWith('user-id', 'new-refresh-hash');
    });

    it('clears the stored refresh token when logout receives a valid access token', async () => {
        authSecurity.validateAccess.mockResolvedValue({
            sub: 'user-id',
            email: 'test@example.com',
        });
        users.setRefreshToken.mockResolvedValue(undefined);

        await service.logout('access-token');

        expect(authSecurity.validateAccess).toHaveBeenCalledWith('access-token');
        expect(users.setRefreshToken).toHaveBeenCalledWith('user-id', null);
    });

    it('refreshes tokens only when the submitted refresh token matches the stored hash', async () => {
        authSecurity.validateRefresh.mockResolvedValue({
            sub: 'user-id',
            email: 'test@example.com',
        });
        users.findByEmail.mockResolvedValue(user);
        users.setRefreshToken.mockResolvedValue(undefined);
        authSecurity.refreshTokenMatches.mockResolvedValue(true);
        authSecurity.createTokens.mockResolvedValue({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        authSecurity.hashRefreshToken.mockResolvedValue('new-refresh-hash');

        await expect(service.refresh('refresh-token')).resolves.toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        expect(authSecurity.refreshTokenMatches).toHaveBeenCalledWith(
            'refresh-token',
            'stored-refresh-hash',
        );
        expect(users.setRefreshToken).toHaveBeenCalledWith('user-id', 'new-refresh-hash');
    });

    it('rejects refresh when the stored refresh token hash is missing', async () => {
        authSecurity.validateRefresh.mockResolvedValue({
            sub: 'user-id',
            email: 'test@example.com',
        });
        users.findByEmail.mockResolvedValue({ ...user, refreshTokenHash: null });

        await expectRpcError(
            service.refresh('refresh-token'),
            status.PERMISSION_DENIED,
            'Invalid refresh token',
        );
        expect(authSecurity.refreshTokenMatches).not.toHaveBeenCalled();
    });
});

async function expectRpcError(
    promise: Promise<unknown>,
    code: status,
    message: string,
): Promise<void> {
    await promise.then(
        () => {
            throw new Error('Expected promise to reject with RpcError.');
        },
        (error: unknown) => {
            expect(error).toBeInstanceOf(RpcError);
            expect((error as RpcError).getError()).toEqual({ code, message });
        },
    );
}
