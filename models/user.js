const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingPasswordError: "パスワードを入力してください",
        AttemptTooSoonError:
            "アカウントがロックされています。しばらくしてから再度お試しください",
        TooManyAttemptsError:
            "アカウントがロックされています。しばらくしてから再度お試しください",
        NoSaltValueStoredError:
            "認証に失敗しました。しばらくしてから再度お試しください",
        IncorrectPasswordError: "パスワードが正しくありません",
        IncorrectUsernameError: "ユーザー名が正しくありません",
        MissingUsernameError: "ユーザー名を入力してください",
        UserExistsError: "既に登録されているユーザー名です",
    },
});

module.exports = mongoose.model("User", UserSchema);
