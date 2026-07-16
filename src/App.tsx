import { Navbar } from '@/sections/Navbar'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Gallery } from '@/sections/Gallery'
import { Advantages } from '@/sections/Advantages'
import { Contact } from '@/sections/Contact'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Gallery />
        <Advantages />
        <Contact />
      </main>
    </>
  )
}

export default App
