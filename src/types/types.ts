export interface INaumovaTeamClient {
    id?: number;
    name: string;
    email: string;
    textarea: string;
    uid: string;
    amount: number;
    stream: number;
    paymentStatus: number;
    textForMailer?: string;
}
