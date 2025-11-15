import Image from "next/image"

export default function Home() {
  return (
    <main>
      <div className="w-[700px] h-[700px] bg-red-300">
        <Image
          src="https://i.pinimg.com/736x/56/1e/8e/561e8eac54e582cfae853bdb8b586663.jpg"
          alt="yi.jpg"
          width={500}
          height={500}
        />
      </div>
    </main>
  )
}
