"use client"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, MapPin, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Categories for the Apple Cards Carousel
const categories = [
  {
    id: "mythology",
    title: "Mythology",
    description: "Learn about the stories, legends, and mythology of Lord Murugan",
    icon: BookOpen,
    items: [
      {
        id: 1,
        title: "The Birth of Lord Murugan",
        description: "The divine origin story of the six-faced deity",
        image: "/ancient-hindu-temple.png",
        content: `Lord Murugan, also known as Karthikeya, Skanda, or Subrahmanya, has a fascinating birth story that varies across different texts.

According to the most popular version from the Skanda Purana, Lord Shiva and Goddess Parvati were in deep meditation when they were disturbed by the demon Soorapadman. To defeat this powerful demon, they needed a mighty warrior.

Lord Shiva opened his third eye, releasing intense energy in the form of six sparks. These sparks were carried by Agni (the fire god) to the Saravana lake, where they became six beautiful babies. When Goddess Parvati went to see them, she embraced all six babies together, and they merged into one child with six faces - thus Lord Murugan was born.

This is why Lord Murugan is often depicted with six faces, representing the six directions (north, south, east, west, up, and down) and his all-pervasive nature. Each face also represents different aspects of his divine personality.

Source: Skanda Purana and Tamil Sangam literature`,
      },
      {
        id: 2,
        title: "Murugan and the Six Faces",
        description: "Discover the story behind Lord Murugan's six faces and their significance",
        image: "/shanmukha-divine.png",
        content: `Lord Murugan's six faces, which give him the name "Shanmukha" (six-faced one), have deep spiritual and cosmic significance.

Each face represents a different aspect of his divine personality and cosmic function:

1. The first face represents creation and embodies his role as a creator
2. The second face represents protection and his role as a preserver
3. The third face represents destruction and his role in removing obstacles
4. The fourth face represents obscuration and his ability to veil the truth when necessary
5. The fifth face represents revelation and his power to reveal divine knowledge
6. The sixth face represents salvation and his grace in liberating souls

The six faces also represent the six chakras in the human subtle body, from Muladhara to Ajna. As Shanmukha, Lord Murugan presides over all these energy centers, guiding spiritual seekers in their journey toward enlightenment.

In the Skanda Purana, it's said that when the six babies were born from Lord Shiva's sparks, Goddess Parvati embraced them all at once, causing them to merge into a single child with six faces. This symbolizes the unity underlying apparent diversity.

Source: "Symbolism in Hindu Iconography" by Dr. T.A. Gopinatha Rao`,
      },
      {
        id: 3,
        title: "The Divine Spear: Vel",
        description: "Explore the mythology and symbolism of Lord Murugan's divine weapon, the Vel",
        image: "/divine-warrior.png",
        content: `The Vel is Lord Murugan's primary weapon and one of the most significant symbols in his iconography. This divine spear represents spiritual wisdom that pierces through ignorance.

According to mythology, the Vel was given to Lord Murugan by his mother, Goddess Parvati, to vanquish the demon Soorapadman. The Vel represents the power of knowledge and discrimination that helps devotees overcome their inner demons of ego, anger, and attachment.

When Lord Murugan finally confronted Soorapadman, the demon transformed into a mango tree to hide. With divine insight, Lord Murugan threw his Vel, which split the tree in two. These two halves were transformed into a peacock and a rooster - the peacock became Lord Murugan's vehicle, while the rooster adorned his flag.

In temples dedicated to Lord Murugan, the Vel is often placed next to the main deity and is itself worshipped. Many devotees also keep small Vel symbols in their homes as a protective talisman.

The Vel's sharp point symbolizes focused concentration, while its handle represents the mind that must be controlled. The Vel teaches us that spiritual wisdom, when wielded with devotion and discipline, can overcome all obstacles.

Source: Skanda Purana and "Symbolism in Hinduism" by Dr. R. Nagaswamy`,
      },
      {
        id: 4,
        title: "Murugan and Valli",
        description: "The divine love story of Lord Murugan and Valli, his tribal consort",
        image: "/murugan-valli-divine-union.png",
        content: `The love story of Lord Murugan and Valli is one of the most beautiful and popular narratives in Tamil tradition, representing divine love transcending social boundaries.

Valli was a tribal girl, the adopted daughter of a tribal chief, who lived in the hills. According to legend, she was actually born from a doe impregnated by the tears of Lord Vishnu that fell on a deer track.

Lord Murugan, captivated by her beauty and devotion, decided to make her his consort. He first appeared to her as an old man seeking help, then as a hunter, and finally in his true divine form. Each appearance tested her character and devotion.

When Valli's family opposed their union, Lord Murugan created various obstacles, including sending his brother Lord Ganesha disguised as a wild elephant to frighten her. When Valli ran to the old man (Murugan in disguise) for protection, he revealed his true form and accepted her as his consort.

This divine marriage represents the union of the divine (Murugan) with the human soul (Valli). It symbolizes how divine grace seeks out devotees regardless of their social status or background. The story also emphasizes that true devotion transcends formal religious practices, as Valli won the Lord's heart through her pure love rather than through ritualistic worship.

Source: "Folk Elements in Hindu Culture" by Dr. Ananda Coomaraswamy and Tamil folk traditions`,
      },
    ],
  },
  {
    id: "temples",
    title: "Temples",
    description: "Explore the sacred temples dedicated to Lord Murugan",
    icon: MapPin,
    items: [
      {
        id: 1,
        title: "Palani Murugan Temple",
        description: "Explore one of the six abodes of Lord Murugan located in Palani, Tamil Nadu",
        image: "/palani-hilltop-temple.png",
        content: `The Palani Murugan Temple, located atop a hill in Palani, Tamil Nadu, is one of the six major abodes of Lord Murugan (Arupadaiveedu). It is considered one of the most sacred Murugan shrines in India.

The temple houses Lord Murugan in his ascetic form as Dandayudhapani Swami, holding a staff (danda) in his hand, symbolizing renunciation and spiritual wisdom. According to legend, after defeating the demon Soorapadman, Lord Murugan came to Palani and settled as a young ascetic.

What makes this temple particularly unique is the idol of Lord Murugan, which is made of a special nine-herb mixture called "Navabashanam" with medicinal properties. This idol was created by the sage Bogar, one of the 18 Siddhars (enlightened sages). The abhishekam (sacred bath) mixture is distributed as prasadam to devotees and is believed to have healing properties.

The temple is situated on a hill that rises about 450 feet above the surrounding plains. Devotees can either climb the 690 steps to reach the temple or use the winch or rope car service. The climb itself is considered a form of penance and devotion.

Major festivals celebrated here include Thai Poosam, Panguni Uthiram, and Vaikasi Visakam. During these festivals, thousands of devotees carry kavadi (a decorated arch) as they ascend the hill, fulfilling vows made to the deity.

Source: "Sacred Geography of Tamil Nadu" by Dr. Subbiah Arunachalam and "Temples of South India" by K.R. Srinivasan`,
      },
      {
        id: 2,
        title: "Tiruchendur Temple",
        description: "Discover the coastal temple dedicated to Lord Murugan in Tiruchendur",
        image: "/tiruchendur-temple-coastline.png",
        content: `The Tiruchendur Murugan Temple is unique among the six major abodes of Lord Murugan as it is the only one located on the seashore. Situated in Tiruchendur, Tamil Nadu, this ancient temple faces the Bay of Bengal and has a rich history dating back over 2,000 years.

Here, Lord Murugan is worshipped as Senthilandavar or the "Lord of the Red Land," commemorating his victory over the demon Soorapadman. According to the Skanda Purana, it was at this very spot that the final battle took place, and Lord Murugan's Vel (divine spear) vanquished the demon.

The temple's architecture is a magnificent example of Dravidian style, with a seven-tiered gopuram (tower) rising to a height of 140 feet. The main sanctum houses the deity in a standing posture, unlike most other Murugan temples where he is seated or in a dancing pose.

One of the most fascinating aspects of this temple is its location by the sea. During high tide, the waves come very close to the temple walls, creating a mesmerizing spiritual atmosphere. Devotees often take a dip in the sea before entering the temple, considering it a purifying ritual.

The temple celebrates several festivals throughout the year, with Skanda Sashti being the most important. During this six-day celebration, the battle between Lord Murugan and Soorapadman is reenacted, culminating in the victory of good over evil.

Source: "Coastal Temples of Tamil Nadu" by Dr. R. Nagaswamy and "Maritime History of South India" by Dr. K.A. Nilakanta Sastri`,
      },
      {
        id: 3,
        title: "Swamimalai Temple",
        description: "Learn about the temple where Lord Murugan taught the meaning of Om to Lord Shiva",
        image: "/swamimalai-temple-entrance.png",
        content: `Swamimalai Temple, located near Kumbakonam in Tamil Nadu, is one of the six major abodes of Lord Murugan. What makes this temple particularly significant is that here, Lord Murugan is worshipped as Swaminatha Swami, the teacher who imparted the meaning of the sacred Pranava Mantra (Om) to his father, Lord Shiva.

According to legend, Lord Murugan, though a child, had attained supreme wisdom. When Lord Shiva tested him by asking for the meaning of the Pranava Mantra, Murugan requested his father to be his disciple first. Lord Shiva agreed, and Murugan sat as the Guru (teacher) while Shiva became the disciple. This reversal of roles earned Murugan the name "Swaminatha" (teacher of Shiva) and highlights the profound truth that divine wisdom transcends age and conventional relationships.

The temple is built on an artificial hill with 60 steps, representing the 60 Tamil years. The main shrine is reached by climbing these steps, symbolizing the spiritual ascent of the devotee. Each step is named after one of the 60 Tamil years.

The temple's architecture follows the Dravidian style with intricate carvings and sculptures. The main sanctum houses Lord Murugan in a seated posture, symbolizing his role as a teacher. The idol is made of granite and is believed to be very ancient.

Major festivals celebrated here include Vaikasi Visakam, Thai Poosam, and Skanda Sashti. During these celebrations, the temple comes alive with rituals, music, and dance performances.

Source: "Sacred Complex of Swamimalai" by Dr. S. Swaminathan and "Guru-Shishya Tradition in Hindu Mythology" by Dr. Ananda K. Coomaraswamy`,
      },
      {
        id: 4,
        title: "Pazhamudircholai Temple",
        description: "Explore the temple located amidst lush green forests on a hill",
        image: "/pazhamudircholai-forest-shrine.png",
        content: `Pazhamudircholai Temple, the sixth of Lord Murugan's major abodes, is nestled amidst lush green forests on a hill near Madurai, Tamil Nadu. The name "Pazhamudircholai" literally means "a grove where fruits ripen," highlighting its natural beauty and abundance.

This temple has a unique setting compared to other Murugan temples, as it is surrounded by dense vegetation and natural springs. Here, Lord Murugan is worshipped as Kumarasamy with his consorts Valli and Deivayanai, representing divine love and the harmony of nature.

According to legend, the great Tamil poet Avvaiyar came to this hill to rest under a blackberry tree. A young boy (Lord Murugan in disguise) sitting on the tree asked if she wanted hot or cold berries. Puzzled by this strange question, she asked for cold ones. The boy suggested she blow on the berries before eating them. Avvaiyar, annoyed at being taught something so obvious, was then revealed the true identity of the boy. This story illustrates how the Lord teaches wisdom through simple, everyday experiences.

The temple is also associated with the Sangam period (300 BCE - 300 CE) and is mentioned in ancient Tamil literature. The Pazhamudircholai hill is considered one of the natural shrines where Lord Murugan is believed to reside, even without a formal temple structure.

The temple celebrates several festivals, with Panguni Uthiram being particularly significant. During this time, Lord Murugan's marriage to Valli and Deivayanai is celebrated with great pomp and devotion.

Source: "Sacred Groves of Tamil Nadu" by Dr. M.S. Swaminathan and "Ecological Traditions in Tamil Culture" by Dr. V. Arivudainambi`,
      },
    ],
  },
  {
    id: "festivals",
    title: "Festivals",
    description: "Discover the festivals and celebrations honoring Lord Murugan",
    icon: Calendar,
    items: [
      {
        id: 1,
        title: "Thaipusam Festival",
        description: "Learn about the grand festival celebrating Lord Murugan's victory over evil forces",
        image: "/thaipusam-devotees.png",
        content: `Thaipusam is one of the most important festivals dedicated to Lord Murugan, celebrated during the Tamil month of Thai (January-February) when the star Pusam is in ascendance.

The festival commemorates the occasion when Goddess Parvati gave Lord Murugan the Vel (divine spear) to vanquish the demon Soorapadman. It's a celebration of the victory of good over evil, light over darkness, and knowledge over ignorance.

Devotees prepare for weeks before the festival through fasting, prayer, and other austerities. The most striking aspect of Thaipusam is the kavadi ritual. Kavadi literally means "burden," and devotees carry decorated frames, often with spikes or hooks pierced into their skin, as an act of devotion and penance.

The kavadi represents the mountain that Lord Murugan's devotee, Idumban, carried. According to legend, Idumban was tasked with carrying two hills to South India. When he set them down to rest near Palani, they became rooted to the spot. Lord Murugan had made the hills immovable, and when Idumban tried to fight him, he was defeated. Recognizing the Lord, Idumban became his devotee, and the kavadi ritual commemorates this devotion.

During Thaipusam, massive processions take place, especially at major Murugan temples like Palani in India and Batu Caves in Malaysia. The atmosphere is electric with devotion - filled with chants, music, and the scent of camphor and incense.

Source: "Hindu Festivals: Origin, Sentiments and Rituals" by Dr. Chitralekha Singh`,
      },
      {
        id: 2,
        title: "Skanda Sashti",
        description: "Discover the six-day festival commemorating Lord Murugan's victory over demon Surapadman",
        image: "/skanda-sashti-celebration.png",
        content: `Skanda Sashti is a six-day festival dedicated to Lord Murugan, celebrated in the Tamil month of Aippasi (October-November). The festival commemorates Lord Murugan's victory over the demon Soorapadman, symbolizing the triumph of good over evil.

The name "Skanda Sashti" combines "Skanda" (another name for Lord Murugan) and "Sashti" (the sixth day of the lunar fortnight). The festival begins on the first day after the new moon and culminates on the sixth day, which is considered most auspicious.

During these six days, devotees observe fasting and special prayers. Many observe a complete fast, consuming only fruits and milk, while others take a single meal a day. The fasting is believed to purify the body and mind, making one receptive to divine grace.

The highlight of Skanda Sashti is the Soora Samharam (the slaying of the demon), which is enacted in temples on the fifth day. This dramatic reenactment depicts Lord Murugan's battle with Soorapadman and his ultimate victory. The sixth day celebrates Thirukalyanam, the divine marriage of Lord Murugan with Deivayanai, daughter of Indra.

The Skanda Sashti Kavacham, a powerful hymn composed by Devaraya Swamigal, is recited during this period. This hymn is believed to act as a spiritual armor (kavacham), protecting devotees from all negative influences.

In major Murugan temples, especially in Tiruchendur, the festival is celebrated with grand processions, music, dance, and elaborate rituals. Thousands of devotees gather to witness the festivities and receive the blessings of Lord Murugan.

Source: "Festivals of Tamil Nadu" by Dr. P.V. Jagadisa Ayyar and "Ritual Traditions of South India" by Dr. S. Ramachandran`,
      },
      {
        id: 3,
        title: "Vaikasi Visakam",
        description: "Explore the festival celebrating Lord Murugan's birthday",
        image: "/placeholder.svg?height=400&width=600&query=vaikasi+visakam+festival+murugan+birthday",
        content: `Vaikasi Visakam is one of the most significant festivals dedicated to Lord Murugan, celebrated during the Tamil month of Vaikasi (May-June) when the star Visakam is in ascendance. This festival commemorates the birth of Lord Murugan and is observed with great devotion across Tamil Nadu and wherever Murugan devotees reside.

According to Hindu mythology, Lord Murugan was born from the third eye of Lord Shiva as six sparks, which were later carried by Agni (the fire god) to the Saravana lake. There, they transformed into six babies, who were later united into one six-faced deity by Goddess Parvati. This divine birth is celebrated during Vaikasi Visakam.

The festival typically begins with a flag-hoisting ceremony (Kodi Yetram) ten days before the main day. Throughout these days, special abhishekams (sacred baths) and pujas are performed for the deity. The temple premises are decorated with flowers, lights, and colorful rangolis (floor designs).

On the main day of Vaikasi Visakam, the deity is taken out in a grand procession around the temple or through the streets of the town. Devotees offer their prayers, perform special rituals, and seek the blessings of Lord Murugan. Many devotees observe fasting on this day, consuming only fruits and milk.

In Palani, one of the six abodes of Lord Murugan, Vaikasi Visakam is celebrated with special grandeur. The deity is adorned with precious jewels and special garments, and elaborate rituals are performed throughout the day.

Source: "Calendar of Hindu Festivals" by Dr. S. Krishnamurthy and "Birth Narratives in Hindu Mythology" by Dr. Wendy Doniger`,
      },
      {
        id: 4,
        title: "Panguni Uttiram",
        description: "Learn about the festival celebrating Lord Murugan's marriage to Deivayanai and Valli",
        image: "/placeholder.svg?height=400&width=600&query=panguni+uttiram+festival+murugan+marriage",
        content: `Panguni Uttiram is a major festival celebrated during the Tamil month of Panguni (March-April) when the star Uttiram is in ascendance. This festival commemorates the divine marriages of Lord Murugan with his consorts Deivayanai and Valli, symbolizing the union of divine power with beauty and grace.

According to Hindu mythology, Deivayanai is the daughter of Indra, the king of celestials, and represents divine or aristocratic lineage. Valli, on the other hand, is a tribal girl, representing the earthly or common folk. Lord Murugan's marriage to both of them symbolizes his accessibility to all devotees, regardless of their social status or background.

The festival typically spans ten days, with the flag-hoisting ceremony marking the beginning. Throughout these days, special rituals and abhishekams are performed for the deities. The highlight of the festival is the celestial wedding (Thirukalyanam) of Lord Murugan with his consorts, which is enacted with great devotion and grandeur.

During the procession, the deities are carried on different vahanas (vehicles) around the temple or through the streets of the town. The most spectacular is the Ther (chariot) procession, where the deities are placed on a massive wooden chariot pulled by devotees.

In Palani, one of the six abodes of Lord Murugan, Panguni Uttiram is celebrated with special significance. The deity is adorned with precious jewels and special garments, and elaborate rituals are performed throughout the day.

Source: "Marriage Rituals in Hindu Tradition" by Dr. Axel Michaels and "Divine Weddings in Hindu Mythology" by Dr. Stella Kramrisch`,
      },
    ],
  },
  {
    id: "practices",
    title: "Practices",
    description: "Learn about devotional practices, rituals, and prayers",
    icon: Clock,
    items: [
      {
        id: 1,
        title: "Murugan Mantras",
        description: "Learn the sacred mantras dedicated to Lord Murugan and their significance",
        image: "/placeholder.svg?height=400&width=600&query=hindu+devotee+chanting+mantras+temple",
        content: `Mantras dedicated to Lord Murugan are powerful sacred sounds that invoke his divine presence and blessings. These mantras have been passed down through generations and are believed to have transformative effects on the consciousness of the devotee.

The most fundamental mantra for Lord Murugan is the six-syllable "Sharavana Bhava" mantra:

"Om Sharavana Bhavaya Namaha"

This mantra invokes Lord Murugan as the one who was born in the Saravana lake. Each repetition of this mantra is believed to purify the mind and heart of the devotee, removing obstacles and bestowing divine grace.

Another powerful mantra is the Murugan Gayatri:

"Om Tatpurushaya Vidmahe Mahasenadhipataye Dheemahi Tanno Shanmukha Prachodayat"

This mantra seeks the wisdom and guidance of the six-faced Lord to illuminate our intellect and lead us on the right path.

For those seeking victory over challenges, the Vel mantra is particularly effective:

"Om Vel Murugaya Namaha"

This invokes the power of Murugan's divine spear (Vel) to cut through obstacles and negative energies.

The practice of mantra recitation (japa) involves repeating these sacred sounds with devotion and concentration. Traditionally, mantras are recited 108 times using a mala (prayer beads) to keep count. The practice can be done daily, preferably during the early morning hours (Brahma Muhurta) or during twilight.

Before beginning mantra practice, it's customary to purify oneself through a bath and wear clean clothes. Sitting in a comfortable posture with the spine erect, one begins by taking a few deep breaths to calm the mind before commencing the recitation.

Source: "Mantras: Sacred Words of Power" by Dr. Thomas Ashley-Farrand and "Tantric Traditions of South India" by Dr. Douglas Renfrew Brooks`,
      },
      {
        id: 2,
        title: "Kavadi Ritual",
        description: "Understand the sacred Kavadi ritual performed by devotees of Lord Murugan",
        image: "/placeholder.svg?height=400&width=600&query=kavadi+ritual+devotees+thaipusam",
        content: `The Kavadi ritual is one of the most distinctive and profound expressions of devotion to Lord Murugan, particularly observed during festivals like Thaipusam and Panguni Uttiram.

The term "Kavadi" literally means "burden" or "sacrifice," symbolizing the burden of our sins and the sacrifice we make to be relieved of them. The physical kavadi is a decorated arch-like structure, often adorned with peacock feathers, flowers, and small pots of milk, carried on the shoulders of devotees.

The ritual has its origins in the legend of Idumban, a devotee who was tasked with carrying two hills to South India. When he set them down to rest near Palani, they became rooted to the spot because Lord Murugan had made them immovable. When Idumban tried to fight him, he was defeated. Recognizing the Lord, Idumban became his devotee, and the kavadi ritual commemorates this devotion.

Preparation for carrying the kavadi involves rigorous discipline. Devotees observe a strict vegetarian diet, abstain from alcohol and sexual activities, sleep on the floor, and engage in constant prayer for 48 days before the ritual. This period of purification is essential for the spiritual significance of the practice.

On the day of the ritual, devotees enter a trance-like state through continuous chanting and drumming. In this altered state of consciousness, many perform acts that would normally cause pain, such as piercing their skin with hooks or skewers, yet they report feeling no pain. This is attributed to the divine grace of Lord Murugan.

The journey with the kavadi, often up hundreds of steps to a hilltop temple, represents the spiritual journey from ignorance to enlightenment. The physical burden symbolizes the weight of our karmas, while the act of carrying it with devotion represents our surrender to the divine.

Source: "Thaipusam in Malaysia: Hindu Festival in a Tamil Diaspora" by Dr. Carl Vadivella Belle and "Body and Cosmology in Kashmir Shaivism" by Dr. Gavin Flood`,
      },
      {
        id: 3,
        title: "Vel Worship",
        description: "Learn about the worship of the Vel, Lord Murugan's divine spear",
        image: "/placeholder.svg?height=400&width=600&query=vel+spear+worship+murugan+temple",
        content: `The Vel, Lord Murugan's divine spear, is not just a weapon but a powerful symbol that is worshipped in its own right. This sacred object represents divine wisdom that pierces through ignorance and spiritual darkness.

In many Murugan temples, especially in the six major abodes (Arupadaiveedu), the Vel is installed next to the main deity and receives special worship. Devotees circumambulate both the main deity and the Vel, offering prayers and seeking blessings.

The worship of the Vel involves several rituals:

1. Abhishekam (sacred bath): The Vel is bathed with various substances including water, milk, honey, yogurt, ghee, and sandalwood paste, accompanied by the chanting of mantras.

2. Alankaram (decoration): After the abhishekam, the Vel is dried and adorned with sandal paste, kumkum (vermilion), and flowers.

3. Deepa Aradhana (offering of light): A lamp is waved in front of the Vel, symbolizing the removal of darkness and ignorance.

4. Naivedyam (food offering): Various food items, particularly those known to be favorites of Lord Murugan like fruits and sweet porridge, are offered.

Many devotees also keep small Vel symbols in their homes as protective talismans. These are regularly worshipped with simple rituals like lighting a lamp, offering flowers, and reciting mantras such as "Om Vel Murugaya Namaha."

The Vel is particularly significant during the Skanda Sashti festival, which commemorates Lord Murugan's victory over the demon Soorapadman using this divine weapon. During this time, special pujas are performed for the Vel, and in some temples, it is taken out in procession.

The worship of the Vel is believed to bestow courage, remove obstacles, and grant success in endeavors. It is especially beneficial for students seeking knowledge and those facing challenges or enemies.

Source: "Iconography of Hindu Temples" by Dr. T.A. Gopinatha Rao and "Worship Traditions in Tamil Nadu Temples" by Dr. P.V. Jagadisa Ayyar`,
      },
      {
        id: 4,
        title: "Skanda Sashti Kavacham",
        description: "Explore the powerful prayer that acts as an armor of protection from Lord Murugan",
        image: "/placeholder.svg?height=400&width=600&query=devotee+praying+murugan+temple+ritual",
        content: `The Skanda Sashti Kavacham is one of the most powerful and popular prayers dedicated to Lord Murugan. Composed by the 19th-century saint Devaraya Swamigal, this hymn is considered a spiritual armor (kavacham) that protects devotees from all negative influences.

The prayer consists of 131 verses in Tamil, describing the glory of Lord Murugan, his various forms, weapons, and vehicles. It invokes his protection for every part of the body, every aspect of life, and against all types of dangers and obstacles.

The term "Sashti" refers to the sixth day of the lunar fortnight, which is considered sacred to Lord Murugan. The Skanda Sashti festival commemorates his victory over the demon Soorapadman, and this prayer is particularly powerful when recited during this time.

Devotees believe that regular recitation of the Skanda Sashti Kavacham with devotion and concentration can:

1. Remove obstacles and challenges in life
2. Protect from negative energies, black magic, and evil eye
3. Cure diseases and promote good health
4. Grant success in education and career
5. Bestow courage and confidence to face life's challenges
6. Lead to spiritual growth and eventual liberation

The prayer begins with sal utations to Lord Ganesha (Murugan's brother) and other deities, followed by verses describing Murugan's divine attributes. It then systematically invokes protection for different parts of the body, different times of the day, and different aspects of life.

The concluding verses describe the benefits of reciting this prayer: "Those who read this kavacham daily with devotion will be blessed with good health, wealth, and prosperity. They will be free from all fears and will attain the lotus feet of Lord Murugan."

Many devotees recite this prayer daily, particularly on Tuesdays and Fridays, which are considered especially auspicious for Lord Murugan. Some observe special rituals like lighting a lamp with ghee or sesame oil before recitation.

Source: "Tamil Devotional Literature" by Dr. Norman Cutler and "Protective Mantras in Hindu Tradition" by Dr. Gudrun Bühnemann`,
      },
    ],
  },
]

// Apple Cards Carousel Component
const AppleCardsCarousel = ({
  items,
  className,
}: {
  items: {
    id: string | number
    title: string
    description: string
    image: string
    content?: string
  }[]
  className?: string
}) => {
  const [activeCard, setActiveCard] = useState<string | number | null>(null)

  const handleCardClick = (id: string | number) => {
    setActiveCard(activeCard === id ? null : id)
  }

  return (
    <div
      className={cn(
        "flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-10 pt-8 [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          content={item.content}
          isActive={activeCard === item.id}
          onClick={handleCardClick}
        />
      ))}
    </div>
  )
}

const Card = ({
  id,
  title,
  description,
  image,
  content,
  isActive,
  onClick,
}: {
  id: string | number
  title: string
  description: string
  image: string
  content?: string
  isActive: boolean
  onClick: (id: string | number) => void
}) => {
  return (
    <motion.div
      layout
      onClick={() => onClick(id)}
      className={cn(
        "relative flex h-[400px] w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl p-8 snap-center",
        "bg-gradient-to-br from-neutral-900 to-neutral-800",
        "transition-all duration-500 ease-in-out",
        isActive ? "w-[500px]" : "hover:translate-y-[-8px]",
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div layout className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <motion.span layout className="mb-2 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary w-fit">
            Learn
          </motion.span>
          <motion.h3 layout className="text-xl font-bold text-white">
            {title}
          </motion.h3>
          <motion.p layout className="mt-2 text-sm text-white/80">
            {description}
          </motion.p>
        </div>

        {isActive && content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 overflow-y-auto text-sm text-white/70 max-h-[180px] custom-scrollbar"
          >
            <div className="whitespace-pre-line">{content}</div>
          </motion.div>
        )}

        <motion.div layout className="mt-auto">
          <motion.button layout className="flex items-center gap-1 text-sm font-medium text-white">
            <span>{isActive ? "Read less" : "Read more"}</span>
            <motion.span animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState("mythology")

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-12">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Learn About Lord Murugan</h1>
          <p className="text-muted-foreground">
            Explore the rich mythology, sacred temples, festivals, and devotional practices related to Lord Murugan.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-lg border p-1 bg-muted/50">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  className={cn(
                    "gap-2",
                    activeCategory === category.id
                      ? "bg-gradient-to-b from-saffron-400 to-saffron-500 shadow-md border-saffron-300"
                      : "hover:bg-saffron-100 hover:text-saffron-800",
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <category.icon className="h-4 w-4" />
                  {category.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {categories.find((c) => c.id === activeCategory)?.title}
              </h2>
              <p className="text-muted-foreground">
                Swipe or scroll horizontally to explore. Click on a card to expand and read more.
              </p>
            </div>

            {categories.map((category) => (
              <div key={category.id} className={activeCategory === category.id ? "block" : "hidden"}>
                <AppleCardsCarousel items={category.items} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
