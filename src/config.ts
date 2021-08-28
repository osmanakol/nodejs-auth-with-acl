import * as dotenv from "dotenv";
import { RedisOptions } from "ioredis";
import { SessionOptions } from "express-session";

dotenv.config({
  path:"devel.env"
});

export const environment = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const APP_SECRET = process.env.APP_SECRET || "4d2ca599b4189f74a771f44b8a8d06f572208b5649f5ae216f8e94612a267ff0"

export const MONGODB_URI = process.env.mongoURIString || "";

/**Redis Setup */
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const REDIS_HOST: string = process.env.REDIS_HOST || "";
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || "";

export const REDIS_OPTIONS: RedisOptions = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
};

/**Redis Setup */



/**Session Setup */

const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MINUTES = ONE_HOUR / 2;
const SIX_HOURS = ONE_HOUR * 6;
const SESSION_SECRET: string = process.env.SESSION_SECRET || "";
export const SESSION_NAME: string = process.env.SESSION_NAME || "";

export const SESSION_ABSOLUTE_TIMEOUT = +(
  process.env.SESSION_ABSOLUTE_TIMEOUT || SIX_HOURS
);

export const SESSION_OPTIONS: SessionOptions = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: +THIRTY_MINUTES,
    secure: !environment,
    sameSite: "lax",
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
};

/**Session Setup */


/**Encryption Settings */
export const BCRYPT_WORK_FACTOR:number = 12
export const BCRYPT_MAX_BYTEST:number = 72
// sha1 -> 160 bits / 8 = 20 bytes * 2 (hex) = 40 bytes
export const EMAIL_VERIFICATION_TOKEN_BYTES:number = 40
// sha256 -> 256 bits / 8 = 32 bytes * 2 (hex) = 64 bytes
export const EMAIL_VERIFICATION_SIGNATURE_BYTES = 64
export const PASSWORD_RESET_BYTES = 40

// Email Verification
export const EMAIL_VERIFICATION_TIMEOUT:number = SIX_HOURS

// Password Reset
export const PASSWORD_RESET_TIMEOUT = ONE_HOUR
/**Encryption Settings */