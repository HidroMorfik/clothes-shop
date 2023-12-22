export default function Example() {
    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
            <main className="relative isolate min-h-screen">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/012/667/985/original/abstract-colorful-pride-month-type-font-wallpaper-background-love-is-love-pride-love-festival-rainbow-pride-gradient-fluid-abstract-background-lgbt-flag-pride-month-blur-wallpaper-free-vector.jpg"
                    alt=""
                    className="absolute inset-0 -z-10 h-screen w-full object-cover object-top"
                />
                <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                    <p className="text-base font-semibold leading-8 text-white">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
                    <p className="mt-4 text-base text-white/70 sm:mt-6">Sorry, we couldn’t find the page you’re looking for.</p>
                    <div className="mt-10 flex justify-center">
                        <a href="#" className="text-sm font-semibold leading-7 text-white">
                            <span aria-hidden="true">&larr;</span> Back to home
                        </a>
                    </div>
                </div>
            </main>
        </>
    )
}
