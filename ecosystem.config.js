/**
 * pm2 배포 설정
 *
 *   npm run build
 *   pm2 start ecosystem.config.js
 *   pm2 restart myeongdong-exchange
 *
 * ADMIN_SESSION_SECRET 은 반드시 배포 서버에서 임의의 긴 문자열로 교체하세요.
 * 값을 바꾸면 기존 관리자 세션 쿠키는 모두 무효화됩니다.
 */
module.exports = {
  apps: [
    {
      name: "myeongdong-exchange",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 9007",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: "9007",
        ADMIN_SESSION_SECRET: "change-me-to-a-long-random-string",
      },
    },
  ],
};
