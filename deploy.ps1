# デプロイ手順を自動化するスクリプト

# 1. public配下の_nextディレクトリを削除
Remove-Item -Recurse -Force .\public\_next

# 2. npm run buildを実行
npm run build

# 3. outディレクトリの内容をpublicディレクトリにコピー
xcopy /E /I /Y .\out\* .\public\

# 4. firebase deployを実行
firebase deploy