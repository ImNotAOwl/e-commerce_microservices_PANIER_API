export class Panier {
    constructor(
        public readonly user: string,
        public readonly articleId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly picture: string,
        public quantity: number | null,
    ){}
}