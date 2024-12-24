import Image from 'next/image'

export function Logo() {
  return (
    <div className="w-full max-w-[200px] mb-8">
      <Image
        src="/logoLDAC.png"
        alt="La Dame au Chignon"
        width={200}
        height={80}
        priority
      />
      <h1 className="text-center text-xl mt-2 tracking-widest">La Dame au Chignon</h1>
    </div>
  )
}

