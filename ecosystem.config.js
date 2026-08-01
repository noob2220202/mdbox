/**
 * pm2 배포 설정
 *
 *   npm run build
 *   pm2 start ecosystem.config.js
 *   pm2 restart myeongdong-exchange
 *
 * 같은 코드베이스를 다른 도메인으로 하나 더 띄울 때는 별도 디렉터리에 clone 한 뒤
 * 이름과 포트만 지정해서 기동하면 됩니다. 파일을 고칠 필요는 없습니다.
 *
 *   APP_NAME=md-exchange PORT=9009 pm2 start ecosystem.config.js
 *
 * ADMIN_SESSION_SECRET 은 저장소에 커밋하지 않습니다.
 * 서버의 .env.production.local 에 넣어두면 next 가 실행 시 읽어갑니다.
 * 값을 바꾸면 기존 관리자 세션 쿠키는 모두 무효화됩니다.
 */
const name = process.env.APP_NAME || "myeongdong-exchange";
const port = process.env.PORT || "9007";

module.exports = {
  apps: [
    {
      name,
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${port}`,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: port,
      },
    },
  ],
};
