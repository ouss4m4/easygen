export default function Home() {
  return (
    <div className="mx-auto max-w-2xl ">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Free webinar, join our newsletter
          <a href="#" className="font-semibold text-indigo-600 ml-2">
            <span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Welcome to the Application</h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          With right-to-left language support and an intuitive e-learning authoring tool, it’s easier than ever to create and share
          high-quality courses with your Arabic-speaking employees today!
        </p>
      </div>
    </div>
  );
}
