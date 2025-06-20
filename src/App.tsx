import React from 'react';
import { 
  Download, 
  Play, 
  Star, 
  Flame, 
  Package, 
  Monitor,
  Globe,
  User,
  Menu,
  Square
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/image.png" 
          alt="Minecraft background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="text-2xl font-bold text-white">
                  ModFusion
                </div>
              </div>

              {/* Navigation Desktop */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Bibliothèque
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </a>
                <a href="#" className="bg-yellow-400 text-black px-3 py-1 rounded-md font-medium hover:bg-yellow-300 transition-colors">
                  ModFusionPrime
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Support
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Servers
                </a>
              </nav>

              {/* Right side */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Globe className="w-4 h-4" />
                  <span>Français</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer transition-colors">
                  <User className="w-4 h-4" />
                  <span>Compte</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Menu className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-xl">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                BOOSTEZ VOTRE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  GAMEPLAY
                </span><br />
                AVEC DES MODS
              </h1>
              
              <p className="text-base lg:text-lg text-gray-200 leading-relaxed">
                Votre jeu ne sera plus jamais le même grâce aux modifications, 
                skins, optimisations...
              </p>
            </div>

            {/* Stats/Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <span className="text-white font-medium">4.4/5</span>
              </div>

              {/* Logo Minecraft + texte - image chargée depuis URL */}
              <div className="flex items-center space-x-2">
                <img 
                  src="https://preview.redd.it/1wo65al6iox71.png?auto=webp&s=416c56a7134cd4395d730524a2bfef29639ab5d8"
                  alt="Minecraft logo" 
                  className="w-6 h-6 object-contain"
                />
                <span className="text-white font-medium">Compatible Minecraft</span>
              </div>

              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="text-white font-medium">21 000+</span>
                <span className="text-gray-300">téléchargements</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
                <Monitor className="w-5 h-5 mr-2" />
                Téléchargement gratuit
              </button>
              
              <button className="inline-flex items-center justify-center px-6 py-3 bg-gray-900/80 hover:bg-gray-800/80 text-white font-semibold rounded-lg border border-gray-600 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Comment ça marche
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Minecraft-style elements */}
      <div className="absolute top-20 right-20 w-6 h-6 bg-green-500 rounded-sm animate-bounce delay-100 shadow-lg opacity-60"></div>
      <div className="absolute bottom-32 right-32 w-5 h-5 bg-blue-500 rounded-sm animate-bounce delay-300 shadow-lg opacity-60"></div>
      <div className="absolute top-1/3 right-10 w-4 h-4 bg-amber-600 rounded-sm animate-pulse opacity-60"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-purple-600 rounded-sm animate-bounce delay-500 shadow-lg opacity-60"></div>
    </div>
  );
}

export default App;
