export interface AccessTokenPayload {
    id: number,
    email: string,
    role: 'user' | 'admin'
}
