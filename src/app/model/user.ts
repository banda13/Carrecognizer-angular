export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;

    token?: string;
}