import { google } from 'googleapis';

export default async function handler(req, res) {
  const code = req.query.code;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  // For demo: return tokens as JSON
  res.status(200).json(tokens);
}