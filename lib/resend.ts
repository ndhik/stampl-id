import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPlanActivatedEmail(
  email: string,
  tenantName: string,
  plan: string,
  periodEnd: Date
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Plan ${plan} kamu sudah aktif — stample.id`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1C1C1C;">Plan <strong>${plan.toUpperCase()}</strong> aktif! 🎉</h2>
        <p>Hei ${tenantName},</p>
        <p>Pembayaran kamu sudah dikonfirmasi. Plan <strong>${plan.toUpperCase()}</strong> kamu di stample.id sudah aktif hingga <strong>${periodEnd.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_TENANT_URL}/dashboard" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1C1C1C; color: #E8A838; text-decoration: none; border-radius: 8px; font-weight: 600;">Buka Dashboard</a>
        <p style="margin-top: 32px; color: #888; font-size: 13px;">Ada pertanyaan? Balas email ini.</p>
      </div>
    `,
  })
}

export async function sendNewMemberEmail(
  email: string,
  tenantName: string,
  memberName: string
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Member baru bergabung — ${tenantName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1C1C1C;">Member baru! 👋</h2>
        <p><strong>${memberName}</strong> baru saja bergabung dengan program loyalitas <strong>${tenantName}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_TENANT_URL}/members" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1C1C1C; color: #E8A838; text-decoration: none; border-radius: 8px; font-weight: 600;">Lihat Members</a>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Reset password stample.id",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1C1C1C;">Reset Password</h2>
        <p>Klik tombol di bawah untuk reset password akunmu. Link berlaku 1 jam.</p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1C1C1C; color: #E8A838; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="margin-top: 16px; color: #888; font-size: 13px;">Jika kamu tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
  })
}
