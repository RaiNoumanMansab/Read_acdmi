import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, identifier, password, role } = req.body;
    const loginId = (identifier || email || username || '').trim();

    if (!loginId || !password) {
      res.status(400).json({ status: 'error', message: 'Email/Username and password are required' });
      return;
    }

    // 1. Try finding user by email or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: loginId, mode: 'insensitive' } },
          { phone: { equals: loginId, mode: 'insensitive' } },
        ],
      },
      include: {
        adminProfile: true,
        studentProfile: {
          include: {
            class: true,
            section: true,
          },
        },
        teacherProfile: true,
      },
    });

    // 2. If not found, try finding student by roll number
    if (!user) {
      const studentRecord = await prisma.student.findFirst({
        where: { rollNo: { equals: loginId, mode: 'insensitive' } },
        include: {
          user: {
            include: {
              adminProfile: true,
              studentProfile: { include: { class: true, section: true } },
              teacherProfile: true,
            },
          },
        },
      });
      if (studentRecord?.user) {
        user = studentRecord.user as any;
      }
    }

    // 3. If not found, try finding teacher by employee ID
    if (!user) {
      const teacherRecord = await prisma.teacher.findFirst({
        where: { empId: { equals: loginId, mode: 'insensitive' } },
        include: {
          user: {
            include: {
              adminProfile: true,
              studentProfile: { include: { class: true, section: true } },
              teacherProfile: true,
            },
          },
        },
      });
      if (teacherRecord?.user) {
        user = teacherRecord.user as any;
      }
    }

    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid institutional email, username, or password' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      return;
    }

    // Verify role if specified (SUPER_ADMIN can access ADMIN, STUDENT can access PARENT portal)
    if (role) {
      const targetRole = String(role).toUpperCase();
      const userRole = String(user.role).toUpperCase();
      const roleAllowed =
        userRole === targetRole ||
        (userRole === 'SUPER_ADMIN' && targetRole === 'ADMIN') ||
        (userRole === 'PARENT' && targetRole === 'STUDENT') ||
        (userRole === 'STUDENT' && targetRole === 'PARENT');

      if (!roleAllowed) {
        res.status(403).json({ status: 'error', message: `Unauthorized: User is registered as ${user.role}, not ${role}` });
        return;
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'read_academy_secret_jwt_key_sahiwal_2026',
      { expiresIn: '7d' }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Determine portal target according to role
    let portalTarget = 'public';
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      portalTarget = 'admin';
    } else if (user.role === 'TEACHER') {
      portalTarget = 'teacher';
    } else if (user.role === 'STUDENT' || user.role === 'PARENT') {
      portalTarget = 'student';
    }

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      portalTarget,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        portalTarget,
        avatarUrl: user.avatarUrl,
        admin: user.adminProfile,
        student: user.studentProfile,
        teacher: user.teacherProfile,
        permissions: user.adminProfile?.permissions || (user.role === 'SUPER_ADMIN' ? ['ALL'] : []),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred during login' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, password, role = 'STUDENT' } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ status: 'error', message: 'Full name, email, and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ status: 'error', message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        role: role.toUpperCase(),
        status: 'PENDING',
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Account registered successfully! Pending administrative verification.',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred during registration' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        adminProfile: true,
        studentProfile: {
          include: {
            class: true,
            section: true,
          },
        },
        teacherProfile: true,
      },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    let portalTarget = 'public';
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      portalTarget = 'admin';
    } else if (user.role === 'TEACHER') {
      portalTarget = 'teacher';
    } else if (user.role === 'STUDENT' || user.role === 'PARENT') {
      portalTarget = 'student';
    }

    res.json({
      status: 'success',
      portalTarget,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        portalTarget,
        avatarUrl: user.avatarUrl,
        admin: user.adminProfile,
        student: user.studentProfile,
        teacher: user.teacherProfile,
        permissions: user.adminProfile?.permissions || (user.role === 'SUPER_ADMIN' ? ['ALL'] : []),
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const {
      fullName,
      phone,
      avatarUrl,
      designation,
      department,
      emergencyContact,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { adminProfile: true, studentProfile: true, teacherProfile: true },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    // Handle password change if requested
    let updatedPasswordHash = user.passwordHash;
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        res.status(400).json({ status: 'error', message: 'Current password is required to change password' });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updatedPasswordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    // Update user base fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl ? avatarUrl.trim() : null }),
        passwordHash: updatedPasswordHash,
      },
      include: {
        adminProfile: true,
        studentProfile: {
          include: { class: true, section: true },
        },
        teacherProfile: true,
      },
    });

    // If admin or super_admin, update AdminProfile
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      if (updatedUser.adminProfile) {
        await prisma.adminProfile.update({
          where: { userId: user.id },
          data: {
            ...(designation && { designation: designation.trim() }),
            ...(department && { department: department.trim() }),
            ...(emergencyContact !== undefined && { emergencyContact: emergencyContact ? emergencyContact.trim() : null }),
          },
        });
      } else {
        await prisma.adminProfile.create({
          data: {
            userId: user.id,
            empId: 'ADM-' + Math.floor(100 + Math.random() * 900),
            designation: designation || 'Administrator',
            department: department || 'Administration',
            permissions: user.role === 'SUPER_ADMIN' ? ['ALL'] : ['MANAGE_ALL'],
            isSuperAdmin: user.role === 'SUPER_ADMIN',
            emergencyContact: emergencyContact || null,
          },
        });
      }
    }

    // Fetch fresh user
    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        adminProfile: true,
        studentProfile: {
          include: { class: true, section: true },
        },
        teacherProfile: true,
      },
    });

    let portalTarget = 'public';
    if (finalUser?.role === 'SUPER_ADMIN' || finalUser?.role === 'ADMIN') {
      portalTarget = 'admin';
    } else if (finalUser?.role === 'TEACHER') {
      portalTarget = 'teacher';
    } else if (finalUser?.role === 'STUDENT' || finalUser?.role === 'PARENT') {
      portalTarget = 'student';
    }

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      portalTarget,
      user: {
        id: finalUser!.id,
        fullName: finalUser!.fullName,
        email: finalUser!.email,
        phone: finalUser!.phone,
        role: finalUser!.role,
        portalTarget,
        avatarUrl: finalUser!.avatarUrl,
        admin: finalUser!.adminProfile,
        student: finalUser!.studentProfile,
        teacher: finalUser!.teacherProfile,
        permissions: finalUser!.adminProfile?.permissions || (finalUser!.role === 'SUPER_ADMIN' ? ['ALL'] : []),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update profile' });
  }
};

