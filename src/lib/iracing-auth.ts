// Helper to get an authenticated client and provide a fetch-like method
export async function getSessionAuthClient(email: string, password: string) {
  const client = new IracingAuthClient(email, password);
  await client.signIn();
  return {
    fetch: async (url: string, options: any = {}) => {
      const api = client.getApiClient();
      // Map fetch options to axios
      const axiosOptions: any = {
        method: options.method || 'GET',
        url,
        headers: options.headers || {},
        data: options.body,
        responseType: 'json',
      };
      const res = await api.request(axiosOptions);
      return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        json: async () => res.data,
      };
    },
  };
}
import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import CryptoJS from 'crypto-js';
import UserAgent from 'user-agents';

export interface AuthResponse {
  authcode?: string;
}

export class IracingAuthClient {
  private apiClient: AxiosInstance;
  private email: string;
  private password: string;
  private authenticated: boolean = false;
  private agent: UserAgent;

  constructor(email: string, password: string) {
    if (!email || !password) throw new Error('Missing email or password');
    this.email = email;
    this.password = password;
    this.agent = new UserAgent({ platform: 'Win32' });
    this.apiClient = wrapper(
      axios.create({
        jar: new CookieJar(),
        withCredentials: true,
        baseURL: 'https://members-ng.iracing.com',
        headers: {
          'User-Agent': this.agent.toString(),
        },
      })
    );
    this.setupAuthInterceptor();
  }

  private encodeCredentials(): string {
    const hash = CryptoJS.SHA256(this.password + this.email.toLowerCase());
    return CryptoJS.enc.Base64.stringify(hash);
  }

  private setupAuthInterceptor() {
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          this.authenticated = false;
          await this.signIn();
        }
        return Promise.reject(error);
      }
    );
  }

  public async signIn(): Promise<void> {
    const hash = this.encodeCredentials();
    const res = await this.apiClient.post<AuthResponse>('/auth', {
      email: this.email,
      password: hash,
    });
    if (res?.data?.authcode) {
      this.authenticated = true;
    } else {
      throw new Error('Authentication failed');
    }
  }

  public getApiClient(): AxiosInstance {
    return this.apiClient;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }
}
