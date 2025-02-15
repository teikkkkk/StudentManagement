<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'], // Cho phép CORS với các API trong routes/api.php
    'allowed_methods' => ['*'], // Cho phép mọi HTTP methods (GET, POST, PUT,...)
    'allowed_origins' => ['http://localhost:3000'], // Cho phép frontend Next.js
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Cho phép mọi header
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, 

];
