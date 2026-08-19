export default function Kewl() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary text-white gap-5 p-4">
      {/* 
      Write something unique about you here! 
      It could be a club you're part of, a weird skill you have, or something special that happened to you.
      Feel free to put links, images, whatever! 
      Don't worry about styling- we aren't grading you on this- it's just to get to know you better! :) 
      */}
      <div className="max-w-[80vw]">
        <p>
          I am a huge cinephile. At least compared to the average person. I love watching films. Analyzing them. Rating them. Talking about them.
          In fact, I got an AMC Stubs A-List membership over the summer to watch as many movies as I could. Unfortunately, there isn't really an AMC
          near campus, so I have to cancel it, but as everyone who has it says, it is absolutely worth your money.
        </p>
        <br />
        <p>
          If you would like to know more about my movie taste, you can visit my{" "}
          <a href="https://letterboxd.com/anishthebud/" target="_blank" className="underline">Letterboxd profile</a>.
        </p>
        <br />
        <p>Or, you can look at this beautiful image with my Top 20 films:</p>
        <img src="/image.png" alt="My Top 20 Films" className="max-w-2xl w-[50%]" />
      </div>
    </div>
  );
}
