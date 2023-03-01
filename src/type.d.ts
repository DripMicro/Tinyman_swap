interface IArticle {
  id: number;
  title: string;
  body: string;
}

type ArticleState = {
  articles: IArticle[];
};

type ArticleAction = {
  type: string;
  article: IArticle;
};

type SwapAction = {
  type: string;
  message: string;
};

type DispatchType = (args: SwapAction) => SwapAction;
