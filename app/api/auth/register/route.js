import { NextResponse } from "next/server";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/constants";
import { hashPassword } from "@/lib/auth/server/password";
import { createUser, findUserByEmail, toPublicUser } from "@/lib/auth/server/users";
import { buildSessionCookie, createSessionToken } from "@/lib/auth/server/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` },
        { status: 400 },
      );
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }

    const user = await createUser({
      email,
      name,
      passwordHash: hashPassword(password),
    });

    const publicUser = toPublicUser(user);
    const token = await createSessionToken(publicUser);

    return NextResponse.json(
      { user: publicUser },
      {
        headers: { "Set-Cookie": buildSessionCookie(token) },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Não foi possível criar a conta." },
      { status: 500 },
    );
  }
}
