export interface Word {
  id?: string;
  foreignWord: string;
  nativeWord: string;
  comment: string;
  createDate: Date;
  lists?: object[];
  rightAnswerQuantity: number;
}
