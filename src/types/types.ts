export interface INaumovaTeamClient {
    id?: number;
    name: string;
    email: string;
    textarea: string;
    uid: string;
    amount: number;
    stream: number;
    paymentStatus: number;
    telNumber: string;
    paymentToken: string;
    telegram: string;
    textForMailer?: string;
}
