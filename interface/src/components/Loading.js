function Loading() {
    return(
        <button type="button" class="flex items-center justify-center flex rounded" disabled>
            <svg class="rounded bg-green-600 animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"/>
            <p className='text-lg text-green-600 font-semibold'>Loading...</p>
        </button>
    )
}

export default Loading;