const planets = [
    {
        name: 'Sun',
        model: '/sun.glb',
        needsEnv: true,
        glowClass: 'glow-wrapper',
        description: 'The Sun is the star at the center of the Solar System and the source of light and heat for all planets.',
        facts: [
            ['Type', 'Yellow Dwarf Star'],
            ['Equatorial Diameter', '865,374 mi'],
            ['Mass', '1.99 × 10³⁰ kg'],
            ['Galactic Center Distance', '26,038 ly'],
            ['Rotation Period', '25 days'],
            ['Galactic Orbit Period', '225 million years'],
            ['Surface Gravity', '274 m/s²'],
            ['Surface Temperature', '5,778 K (9,941°F)']
        ],
        funFacts: `The Sun is not just a giant ball of fire — it’s a star made of burning gas, mostly hydrogen and helium. It provides the light and warmth we need to survive. Even though it's 93 million miles away, it takes only 8 minutes for sunlight to reach Earth. The Sun is so massive that over 1 million Earths could fit inside it! Without the Sun, life as we know it wouldn't exist.`
    },
    {
        name: 'Mercury',
        model: '/mercury2.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Mercury is the smallest planet in the Solar System and closest to the Sun.',
        facts: [
            ['Type', 'Terrestrial Planet'],
            ['Equatorial Diameter', '3,031 mi'],
            ['Mass', '3.30 × 10²³ kg'],
            ['Distance from Sun', '36 million mi'],
            ['Rotation Period', '59 Earth days'],
            ['Orbit Period', '88 Earth days'],
            ['Surface Gravity', '3.7 m/s²'],
            ['Surface Temperature', '-173 to 427°C']
        ],
        funFacts: `Mercury is the smallest planet and the closest to the Sun, but it’s not the hottest! Because it has no atmosphere to trap heat, it gets extremely hot during the day and freezing cold at night. A single day on Mercury (sunrise to sunrise) is longer than its year. It’s covered in craters, much like our Moon.`
    },
    {
        name: 'Venus',
        model: '/venus.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Venus is the second planet from the Sun and has a thick, toxic atmosphere.',
        facts: [
            ['Type', 'Terrestrial Planet'],
            ['Equatorial Diameter', '7,520.8 mi'],
            ['Mass', '4.87 × 10²⁴ kg'],
            ['Distance from Sun', '67 million mi'],
            ['Rotation Period', '243 Earth days (retrograde)'],
            ['Orbit Period', '225 Earth days'],
            ['Surface Gravity', '8.87 m/s²'],
            ['Surface Temperature', '471°C (880°F)']
        ],
        funFacts: `Venus is sometimes called Earth’s twin because of its size and shape, but it's far from friendly. Its thick atmosphere traps heat like a giant oven, making it the hottest planet. It rains acid and the pressure on its surface would crush a human. Oddly enough, Venus spins backward and very slowly — a day on Venus is longer than a year!`
    },
    {
        name: 'Earth',
        model: '/earth.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
        facts: [
            ['Type', 'Terrestrial Planet'],
            ['Equatorial Diameter', '7,917.5 mi'],
            ['Mass', '5.97 × 10²⁴ kg'],
            ['Distance from Sun', '93 million mi'],
            ['Rotation Period', '24 hours'],
            ['Orbit Period', '365.25 days'],
            ['Surface Gravity', '9.8 m/s²'],
            ['Surface Temperature', '13°C average']
        ],
        funFacts: `This is where we live! Earth is the only planet we know that supports life. It has oceans, air to breathe, and a protective magnetic field. Earth’s atmosphere keeps temperatures just right and shields us from harmful space radiation. It also has one moon, which helps control ocean tides and keeps our climate stable.`
    },
    {
        name: 'Mars',
        model: '/mars.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Mars is known as the Red Planet and is home to the tallest mountain in the Solar System.',
        facts: [
            ['Type', 'Terrestrial Planet'],
            ['Equatorial Diameter', '4,212 mi'],
            ['Mass', '6.42 × 10²³ kg'],
            ['Distance from Sun', '142 million mi'],
            ['Rotation Period', '24.6 hours'],
            ['Orbit Period', '687 Earth days'],
            ['Surface Gravity', '3.71 m/s²'],
            ['Surface Temperature', '-63°C average']
        ],
        funFacts: `Known as the Red Planet, Mars gets its color from iron in the soil. It has the tallest volcano in the solar system and once had flowing water. Scientists think it may have supported life a long time ago, and many believe we could live there in the future. Mars has seasons, dust storms, and polar ice caps — just like Earth.`
    },
    {
        name: 'Jupiter',
        model: '/jupiter.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Jupiter is the largest planet in the Solar System and has a giant red storm.',
        facts: [
            ['Type', 'Gas Giant'],
            ['Equatorial Diameter', '86,881 mi'],
            ['Mass', '1.90 × 10²⁷ kg'],
            ['Distance from Sun', '484 million mi'],
            ['Rotation Period', '10 hours'],
            ['Orbit Period', '11.9 Earth years'],
            ['Surface Gravity', '24.79 m/s²'],
            ['Surface Temperature', '-108°C']
        ],
        funFacts: `Jupiter is the giant of our solar system — more than 1,300 Earths could fit inside! It has a massive storm called the Great Red Spot that’s been spinning for centuries. Jupiter has more than 90 moons, including Ganymede, the largest moon in the entire solar system. Its gravity protects the inner planets by pulling in comets and asteroids.`
    },
    {
        name: 'Saturn',
        model: '/saturn.glb',
        modelScale: '2 2 2',
        glowClass: '',
        needsEnv: false,
        description: 'Saturn is famous for its stunning rings made of ice and rock.',
        facts: [
            ['Type', 'Gas Giant'],
            ['Equatorial Diameter', '74,900 mi'],
            ['Mass', '5.68 × 10²⁶ kg'],
            ['Distance from Sun', '888 million mi'],
            ['Rotation Period', '10.7 hours'],
            ['Orbit Period', '29.5 Earth years'],
            ['Surface Gravity', '10.44 m/s²'],
            ['Surface Temperature', '-139°C']
        ],
        funFacts: `Saturn is famous for its stunning rings made of ice and rock chunks. It’s so light that it could float in water — if you could find a big enough bathtub! Even though it’s huge, a day on Saturn only lasts about 10 hours. Some of its moons may have oceans under their surfaces, possibly holding signs of life.`
    },
    {
        name: 'Uranus',
        model: '/uranus.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Uranus rotates on its side and has a pale blue color due to methane in its atmosphere.',
        facts: [
            ['Type', 'Ice Giant'],
            ['Equatorial Diameter', '31,518 mi'],
            ['Mass', '8.68 × 10²⁵ kg'],
            ['Distance from Sun', '1.78 billion mi'],
            ['Rotation Period', '17.2 hours'],
            ['Orbit Period', '84 Earth years'],
            ['Surface Gravity', '8.69 m/s²'],
            ['Surface Temperature', '-195°C']
        ],
        funFacts: `Uranus is unique because it spins on its side, like a rolling ball. This means its poles get 42 years of sunlight and 42 years of darkness! It’s icy and pale blue due to methane gas in the atmosphere. Scientists believe Uranus might have a rocky core surrounded by icy materials and a thick atmosphere.`
    },
    {
        name: 'Neptune',
        model: '/neptune.glb',
        glowClass: '',
        needsEnv: false,
        description: 'Neptune is a deep blue planet known for its strong winds and storms.',
        facts: [
            ['Type', 'Ice Giant'],
            ['Equatorial Diameter', '30,598 mi'],
            ['Mass', '1.02 × 10²⁶ kg'],
            ['Distance from Sun', '2.79 billion mi'],
            ['Rotation Period', '16 hours'],
            ['Orbit Period', '165 Earth years'],
            ['Surface Gravity', '11.15 m/s²'],
            ['Surface Temperature', '-201°C']
        ],
        funFacts: `Neptune is the farthest planet from the Sun and has the strongest winds in the solar system — up to 1,200 mph! It’s a deep blue ice giant, and even though it’s far away, it still has weather like storms and clouds. Neptune’s moon Triton orbits backward, which may mean it was captured from space.`
    }
];

export default planets;
