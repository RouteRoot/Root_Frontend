export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
                        <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="
이메일을 입력하세요" required />    
                    </div>
                    <div>                       
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="비밀번호를 입력하세요" required />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">로그인</button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    계정이 없으신가요? <a href="/signup" className="text-indigo-600 hover:text-indigo-700">회원가입</a>
                </p>
            </div>
        </div>
    );
}