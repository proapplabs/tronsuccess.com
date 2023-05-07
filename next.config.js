const nextTranslate = require("next-translate");

module.exports = nextTranslate({
    reactStrictMode: true,
    env: {
        AUTH_KEY: "iR12ii68345gdfg4dfg5dfdceFTlVYwfWVbhl2cjR5QNM2z9lf3LZfzJ6snXYMAfI5rPQOUsGwow",
        API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidHJvbnN1Y2Nlc3MuY29tIiwiaWF0IjoxNjgzNDkxMDMyNzg4LCJleHAiOjE4MjAyNzUyMDAwMDB9.OXQTvi2CvGHsE65fHwQ2fnRjO__jYWKnpWGWqSUltH8",
        // CORE_API_URL: "http://localhost:3000/api/v1/",
        CORE_API_URL: "https://tronsuccess.com/api/v1/",
        CORE_PASSWORD: "e04100e1fe1c3b62d89e9b97d720ed9b0d6928678ece91e659f1e2768458c927",
        PRIVATE_API_KEY: "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEGe",
        PRIVATE_AUTH_KEY: "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEGe",
        TRON_FULLHOST: "https://api.trongrid.io",
        TRON_FULLHOST_TEST: "https://api.shasta.trongrid.io",
        TRON_TEST_MODE: true,
        SUPABASE_API_PUBLIC_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y3hzdnlkb2tpeXNleXNvb3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUxNzY2NDksImV4cCI6MTk4MDc1MjY0OX0.Ko-DY85nyfXsRvMo0TwqLIDbzu36Zxtu2H_RrmTTmJM',
        SUPABASE_API_URL: 'https://ozcxsvydokiyseysoozs.supabase.co',
        SUPABASE_API_JWT: '6JC5+0ccSYVMGyKjKs0J4YhPb45B5HNcrniSG2T9u6zPQNhwsO9n+z0PBQWcxS0ARNBuI9ba8vASANYalRNh9w==',
        SUPABASE_API_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Y3hzdnlkb2tpeXNleXNvb3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUxNzY2NDksImV4cCI6MTk4MDc1MjY0OX0.Ko-DY85nyfXsRvMo0TwqLIDbzu36Zxtu2H_RrmTTmJM',
        TRON_NETWORK: "https://api.trongrid.io",
        EXCHANGE_RATE: 0.064
    }
});