// async関数の中でエラーが発生した場合、そのエラーを次のミドルウェアに渡すために、catchAsync関数を作成します。
// async関数をラップして、エラーが発生した場合にnext関数にエラーを渡すようにします。
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((e) => next(e));
    };
};

module.exports = catchAsync;
