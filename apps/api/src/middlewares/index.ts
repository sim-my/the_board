import { Request, Response, NextFunction } from 'express'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { payload } = await jwtVerify(token, secret)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}