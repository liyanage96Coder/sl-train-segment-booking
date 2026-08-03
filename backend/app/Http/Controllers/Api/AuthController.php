<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return $this->respond(false, 422, 'Validation failed', [
                'errors' => $e->errors(),
            ]);
        }

        try {
            $token = Auth::guard('api')->attempt($credentials);
        } catch (JWTException $e) {
            return $this->respond(false, 500, 'Could not create authentication token');
        }

        if (!$token) {
            return $this->respond(false, 401, 'Incorrect email or password');
        }

        $guard = Auth::guard('api');

        return $this->respond(true, 200, 'Login successful', [
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $guard->factory()->getTTL() * 60,
            'user' => $guard->user(),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();

            if (!$user) {
                return $this->respond(false, 401, 'Not authenticated');
            }

            return $this->respond(true, 200, 'User retrieved', ['user' => $user]);
        } catch (TokenExpiredException $e) {
            return $this->respond(false, 401, 'Session expired, please log in again');
        } catch (TokenInvalidException $e) {
            return $this->respond(false, 401, 'Invalid session token');
        } catch (JWTException $e) {
            return $this->respond(false, 401, 'Authentication token missing or malformed');
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            Auth::guard('api')->logout();

            return $this->respond(true, 200, 'Logged out successfully');
        } catch (TokenExpiredException $e) {
            return $this->respond(true, 200, 'Session already expired');
        } catch (JWTException $e) {
            return $this->respond(false, 400, 'Could not log out, invalid or missing token');
        }
    }

    private function respond(bool $status, int $statusCode, string $message, array $data = []): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }
}