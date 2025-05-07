import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {/* Logo bisa diganti sesuai kebutuhan */}
          {/* <img src="/assets/logo.png" alt="Logo" className="h-16 mb-2" /> */}
          <h2 className="text-2xl font-bold mb-2">Masuk ke TomaTech</h2>
          <p className="text-gray-500 text-center">Silakan login menggunakan akun Google Anda</p>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
          // onClick={handleGoogleLogin} // Aktifkan jika sudah ada fungsi login
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Login dengan Google
        </button>
      </div>
    </div>
  );
};

export default Login;