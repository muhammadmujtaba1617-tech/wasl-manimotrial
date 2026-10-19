import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service.js';
import { UserRole } from '@wasl/shared-types';

const RequestOtpSchema = z.object({
  phone: z.string().min(10).max(20)
});

const VerifyOtpSchema = z.object({
  phone: z.string().min(10).max(20),
  code: z.string().length(6),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CANDIDATE)
});

const RequestEmailOtpSchema = z.object({
  email: z.string().email()
});

const VerifyEmailOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CANDIDATE)
});

const PasswordAuthSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(4),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CANDIDATE)
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  // Password Register
  app.post('/register', async (request, reply) => {
    const parseResult = PasswordAuthSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const { identifier, password, role } = parseResult.data;
      const res = await AuthService.registerWithPassword(identifier, password, role);

      if (!res.valid || !res.user) {
        return reply.status(400).send({ error: res.error || 'Registration failed' });
      }

      const token = app.jwt.sign({
        userId: res.user.id,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role
      }, { expiresIn: '7d' });

      return reply.send({
        success: true,
        token,
        user: res.user
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // Password Login
  app.post('/login', async (request, reply) => {
    const parseResult = PasswordAuthSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const { identifier, password, role } = parseResult.data;
      const res = await AuthService.loginWithPassword(identifier, password, role);

      if (!res.valid || !res.user) {
        return reply.status(400).send({ error: res.error || 'Invalid credentials' });
      }

      const token = app.jwt.sign({
        userId: res.user.id,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role
      }, { expiresIn: '7d' });

      return reply.send({
        success: true,
        token,
        user: res.user
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // Phone OTP
  app.post('/phone/request-otp', async (request, reply) => {
    const parseResult = RequestOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const { phone } = parseResult.data;
    const result = await AuthService.requestOtp(phone);
    return reply.send(result);
  });

  app.post('/phone/verify-otp', async (request, reply) => {
    const parseResult = VerifyOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const { phone, code, role } = parseResult.data;
    const verification = await AuthService.verifyOtp(phone, code, role);

    if (!verification.valid || !verification.user) {
      return reply.status(400).send({ error: verification.error || 'Verification failed' });
    }

    const token = app.jwt.sign({
      userId: verification.user.id,
      phone: verification.user.phone,
      role: verification.user.role
    }, { expiresIn: '7d' });

    return reply.send({
      success: true,
      token,
      user: verification.user
    });
  });

  // Email OTP
  app.post('/email/request-otp', async (request, reply) => {
    const parseResult = RequestEmailOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    try {
      const result = await AuthService.requestEmailOtp(parseResult.data.email);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  app.post('/email/verify-otp', async (request, reply) => {
    const parseResult = VerifyEmailOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const { email, code, role } = parseResult.data;
    const verification = await AuthService.verifyOtp(email, code, role);

    if (!verification.valid || !verification.user) {
      return reply.status(400).send({ error: verification.error || 'Verification failed' });
    }

    const token = app.jwt.sign({
      userId: verification.user.id,
      email: verification.user.email,
      role: verification.user.role
    }, { expiresIn: '7d' });

    return reply.send({
      success: true,
      token,
      user: verification.user
    });
  });
};
