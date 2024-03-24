export interface INaumovaTeamClient {
    id?: number;
    name: string;
    email: string;
    textarea: string;
    uid: string;
    amount: number;
    stream: number;
    paymentStatus: number;
    telegram: string;
    telNumber: string;
    paymentToken: string;
    textForMailer?: string;
}
