import * as jwt from 'jsonwebtoken';
import * as qs from 'querystring';
import axios from 'axios';

const signWithApplePrivateKey = process.env.APPLE_SCRET_KEY ?? '';

export const createSignWithAppleSecret = () => {
  const token = jwt.sign({}, signWithApplePrivateKey, {
    algorithm: 'ES256',
    expiresIn: '1h',
    audience: 'https://appleid.apple.com',
    issuer: process.env.APPLE_TEAM_ID, // TEAM_ID
    subject: process.env.APPLE_SERVICE_ID, // Service ID
    keyid: process.env.APPLE_KEY_ID, // KEY_ID
  });
  return token;
};

export const getAppleToken = async (code: string, app?: string) =>
  axios.post(
    'https://appleid.apple.com/auth/token',
    qs.stringify({
      grant_type: 'authorization_code',
      code,
      client_secret: createSignWithAppleSecret(),
      client_id: process.env.APPLE_SERVICE_ID,
      redirect_uri: app
        ? `${process.env.APPLE_REDIRECT_URI}/app`
        : process.env.APPLE_REDIRECT_URI,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
