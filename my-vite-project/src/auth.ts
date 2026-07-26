//this class accesses users info given upon logging in to save later
import { jwtDecode } from 'jwt-decode';

interface MyTokenPayload {
    nameIdentifier: string;
    emailAddress: string;
    roles: string[];
    exp: number;
}


class Auth {
    private token!: string | null
    private payload!: MyTokenPayload | null;

    constructor() {
        this.loadToken();
    }

    private loadToken() {
        this.token = localStorage.getItem('JWTtoken');
        try {
            const raw = this.token ? jwtDecode<any>(this.token) : null;
            if (raw) {
                this.payload = {
                    nameIdentifier: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    emailAddress: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                    roles: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                    exp: raw.exp
                };
            } else {
                this.payload = null;
            }
        } catch {
            this.payload = null;
        }
    }

    refresh() {
        this.loadToken();
    }

    getUserId() {
        return this.payload?.nameIdentifier || null;
    }

    getUserEmail() {
        return this.payload?.emailAddress || 'Guest@gmail.com';
    }

    isTokenExpired() {
        if (!this.payload?.exp) return true;
        return this.payload.exp * 1000 < Date.now();
    }

    removeToken(){
        localStorage.clear();
    }
}
export const auth = new Auth();