"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('User Controller', () => {
    let userId;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a test user
        const user = yield prisma.user.create({
            data: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'testpassword',
            },
        });
        userId = user.userId;
        // Simulate login to get token (replace with your actual login route if needed)
        const res = yield (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'testpassword' });
        token = res.body.token;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.user.deleteMany({ where: { email: 'testuser@example.com' } });
        yield prisma.$disconnect();
    }));
    it('should update user info', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'updateduser', email: 'updateduser@example.com' });
        expect(res.status).toBe(200);
        expect(res.body.username).toBe('updateduser');
        expect(res.body.email).toBe('updateduser@example.com');
    }));
    it('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
    it('should get authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default)
            .post('/api/users/authenticated')
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('userId');
    }));
});
