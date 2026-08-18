import { Metadata, status } from '@grpc/grpc-js';
import { RpcError } from '../common/errors/rpc.error.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

type MockAuthService = jest.Mocked<Pick<AuthService, 'login' | 'logout' | 'refresh' | 'register'>>;

describe(AuthController.name, () => {
    let controller: AuthController;
    let authService: MockAuthService;

    beforeEach(() => {
        authService = {
            login: jest.fn(),
            logout: jest.fn(),
            refresh: jest.fn(),
            register: jest.fn(),
        };
        controller = new AuthController(authService as unknown as AuthService);
    });

    it('passes the metadata token to refresh', async () => {
        const metadata = new Metadata();
        metadata.add('X-User-Token', 'refresh-token');
        authService.refresh.mockResolvedValue({
            accessToken: 'access-token',
            refreshToken: 'next-refresh-token',
        });

        await expect(controller.refreshToken({}, metadata)).resolves.toEqual({
            accessToken: 'access-token',
            refreshToken: 'next-refresh-token',
        });
        expect(authService.refresh).toHaveBeenCalledWith('refresh-token');
    });

    it('passes the metadata token to logout', async () => {
        const metadata = new Metadata();
        metadata.add('X-User-Token', 'access-token');
        authService.logout.mockResolvedValue(undefined);

        await controller.logout({}, metadata);

        expect(authService.logout).toHaveBeenCalledWith('access-token');
    });

    it('throws an RPC error when token metadata is missing', () => {
        expect(() => controller.refreshToken({}, new Metadata())).toThrow(RpcError);

        try {
            controller.refreshToken({}, new Metadata());
        } catch (error) {
            expect((error as RpcError).getError()).toEqual({
                code: status.UNAUTHENTICATED,
                message: 'Missing user token.',
            });
        }
    });
});
