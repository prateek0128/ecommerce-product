type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Kitchen'
  | 'Books'
  | 'Automotive'
  | 'Office Supplies'
  | 'Pet Supplies'
  | 'Health & Beauty'
  | 'Toys & Games'
  | 'Sports & Outdoors'
  | 'Garden & Outdoor'
  | 'Jewelry & Watches'
  | 'Arts & Crafts'
  | 'Musical Instruments'
  | 'Baby Products'
  | 'Food & Beverage'
  | 'Industrial & Scientific'
  | 'Travel'
  | 'Furniture'
  | 'Hobbies';
type Subcategory =
  | 'MobilePhones'
  | 'Laptops'
  | 'Headphones'
  | 'Cameras'
  | 'Smartwatches'
  | 'Televisions'
  | 'HomeAudio'
  | 'WearableTechnology'
  | 'GamingConsoles'
  | 'SmartHomeDevices'
  | 'Drones'
  | 'PortableSpeakers'
  | 'MensClothing'
  | 'WomensClothing'
  | 'KidsClothing'
  | 'Accessories'
  | 'Footwear'
  | 'Activewear'
  | 'Outerwear'
  | 'Swimwear'
  | 'Sleepwear'
  | 'PlusSize'
  | 'Maternity'
  | 'Uniforms'
  | 'Furniture'
  | 'Cookware'
  | 'Decor'
  | 'Appliances'
  | 'Bedding'
  | 'StorageSolutions'
  | 'OutdoorFurniture'
  | 'Lighting'
  | 'GardenTools'
  | 'CleaningSupplies'
  | 'KitchenStorage'
  | 'SmallKitchenAppliances'
  | 'Barware'
  | 'Fiction'
  | 'NonFiction'
  | 'Educational'
  | 'ChildrensBooks'
  | 'ComicsGraphicNovels'
  | 'Cookbooks'
  | 'SelfHelp'
  | 'Biographies'
  | 'ScienceFictionFantasy'
  | 'History'
  | 'Romance'
  | 'Travel'
  | 'Cookery'
  | 'Skincare'
  | 'Haircare'
  | 'PersonalCare'
  | 'VitaminsSupplements'
  | 'Makeup'
  | 'Fragrances'
  | 'FitnessEquipment'
  | 'OralCare'
  | 'MensGrooming'
  | 'BodyCare'
  | 'HairTools'
  | 'HealthMonitors'
  | 'Wellness'
  | 'ActionFigures'
  | 'BoardGames'
  | 'EducationalToys'
  | 'Dolls'
  | 'OutdoorPlay'
  | 'BuildingToys'
  | 'Puzzles'
  | 'PretendPlay'
  | 'RemoteControl'
  | 'RideOns'
  | 'ArtsCrafts'
  | 'ElectronicToys'
  | 'STEMToys'
  | 'CampingHiking'
  | 'FitnessExercise'
  | 'SportsEquipment'
  | 'Cycling'
  | 'Fishing'
  | 'WaterSports'
  | 'WinterSports'
  | 'Running'
  | 'OutdoorFurniture'
  | 'SportsApparel'
  | 'YogaPilates'
  | 'ClimbingGear'
  | 'Golf'
  | 'CarElectronics'
  | 'InteriorAccessories'
  | 'ExteriorAccessories'
  | 'ToolsEquipment'
  | 'CarCare'
  | 'ReplacementParts'
  | 'MotorcyclesATVs'
  | 'CarSafety'
  | 'AutoDetailing'
  | 'TruckAccessories'
  | 'CarCovers'
  | 'TowingEquipment'
  | 'CarLighting'
  | 'Furniture'
  | 'Stationery'
  | 'PrinterSupplies'
  | 'OfficeElectronics'
  | 'Organization'
  | 'OfficeDecor'
  | 'DesksChairs'
  | 'MailingSupplies'
  | 'BreakroomSupplies'
  | 'CalendarsPlanners'
  | 'FilingStorage'
  | 'Whiteboards'
  | 'PresentationSupplies'
  | 'DogSupplies'
  | 'CatSupplies'
  | 'BirdSupplies'
  | 'FishSupplies'
  | 'SmallAnimalSupplies'
  | 'PetFurniture'
  | 'PetHealth'
  | 'Grooming'
  | 'TrainingBehavior'
  | 'PetTravel'
  | 'AquariumSupplies'
  | 'ReptileSupplies'
  | 'PetApparel'
  | 'Plants'
  | 'GardenTools'
  | 'OutdoorFurniture'
  | 'GrillsOutdoorCooking'
  | 'PlantersPots'
  | 'OutdoorLighting'
  | 'Fencing'
  | 'GardeningSupplies'
  | 'OutdoorDecor'
  | 'Landscaping'
  | 'WaterFeatures'
  | 'OutdoorHeating'
  | 'PatioFurniture'
  | 'NecklacesPendants'
  | 'Earrings'
  | 'Bracelets'
  | 'Rings'
  | 'Watches'
  | 'BroochesPins'
  | 'MensJewelry'
  | 'JewelrySets'
  | 'JewelryCareStorage'
  | 'EngagementWedding'
  | 'LuxuryWatches'
  | 'FashionJewelry'
  | 'CustomJewelry'
  | 'DrawingPainting'
  | 'CraftSupplies'
  | 'SewingKnitting'
  | 'BeadingJewelryMaking'
  | 'Scrapbooking'
  | 'ModelBuilding'
  | 'ArtSupplies'
  | 'FabricTextiles'
  | 'CraftKits'
  | 'PaintingTools'
  | 'DIYProjects'
  | 'ArtStorage'
  | 'CraftTools'
  | 'Guitars'
  | 'PianosKeyboards'
  | 'Drums'
  | 'OrchestralInstruments'
  | 'WindInstruments'
  | 'ElectronicInstruments'
  | 'RecordingEquipment'
  | 'Accessories'
  | 'SheetMusic'
  | 'Amplifiers'
  | 'InstrumentCare'
  | 'Microphones'
  | 'DJEquipment'
  | 'Clothing'
  | 'DiapersWipes'
  | 'Feeding'
  | 'NurseryFurniture'
  | 'Toys'
  | 'BabyGear'
  | 'HealthSafety'
  | 'Bedding'
  | 'TravelGear'
  | 'Bath'
  | 'CarSeats'
  | 'BabyMonitors'
  | 'SwingsBouncers'
  | 'Snacks'
  | 'Beverages'
  | 'Groceries'
  | 'GourmetFoods'
  | 'HealthFoods'
  | 'SpecialtyFoods'
  | 'Organic'
  | 'AlcoholicBeverages'
  | 'CookingIngredients'
  | 'SaucesCondiments'
  | 'BakingSupplies'
  | 'MealKits'
  | 'CoffeeTea'
  | 'LabEquipment'
  | 'IndustrialTools'
  | 'SafetyEquipment'
  | 'ScientificInstruments'
  | 'CleaningSupplies'
  | 'OfficeSupplies'
  | 'MaterialHandling'
  | 'MeasuringTesting'
  | 'HVAC'
  | 'WorkplaceSafety'
  | 'ConstructionSupplies'
  | 'IndustrialLighting'
  | 'PumpsValves'
  | 'Luggage'
  | 'TravelAccessories'
  | 'TravelClothing'
  | 'OutdoorGear'
  | 'TravelGuides'
  | 'Electronics'
  | 'TravelBags'
  | 'TravelToiletries'
  | 'CampingEquipment'
  | 'TravelHealth'
  | 'TravelOrganizers'
  | 'TravelSecurity'
  | 'TravelPillows'
  | 'LivingRoomFurniture'
  | 'BedroomFurniture'
  | 'OfficeFurniture'
  | 'OutdoorFurniture'
  | 'StorageOrganization'
  | 'DiningRoomFurniture'
  | 'KidsFurniture'
  | 'FurnitureSets'
  | 'Mattresses'
  | 'AccentFurniture'
  | 'HomeOfficeFurniture'
  | 'FurnitureAccessories'
  | 'ModelTrains'
  | 'RCVehicles'
  | 'Drones'
  | 'Collectibles'
  | 'Puzzles'
  | 'BoardGames'
  | 'CraftKits'
  | 'HobbyTools'
  | 'KitsSupplies'
  | 'Gardening'
  | 'BirdWatching'
  | 'Fishing';

type RepairParts = {
  [key in Category]: {
    [key in Subcategory]?: string[]; // Optional subcategories
  };
};

const repairParts: RepairParts = {
  Electronics: {
    MobilePhones: ['Screen replacement', 'Batteries', 'Charging ports', 'Speakers', 'Camera modules', 'Buttons'],
    Laptops: ['Batteries', 'Screens', 'Keyboards', 'Hinges', 'SSDs', 'RAM', 'Cooling fans'],
    Headphones: ['Ear pads', 'Wires', 'Audio jacks', 'Drivers', 'Headbands'],
    Cameras: ['Lenses', 'Battery doors', 'Shutter buttons', 'LCD screens', 'Memory card slots'],
    Smartwatches: ['Straps', 'Batteries', 'Screens', 'Sensors', 'Charging docks'],
    Televisions: ['Screens', 'Remote controls', 'Capacitors', 'Power boards', 'HDMI ports'],
    HomeAudio: ['Speakers', 'Wires', 'Capacitors', 'Resistors', 'Volume knobs'],
    WearableTechnology: ['Batteries', 'Bands', 'Screens', 'Sensors'],
    GamingConsoles: ['HDMI ports', 'Cooling fans', 'Power supplies', 'Controllers', 'Disc drives'],
    SmartHomeDevices: ['Power adapters', 'Sensors', 'Batteries', 'Connectivity modules'],
    Drones: ['Propellers', 'Batteries', 'Motors', 'Camera gimbals', 'Controllers'],
    PortableSpeakers: ['Batteries', 'Speakers', 'Charging ports', 'Control buttons']
  },
  Clothing: {
    MensClothing: ['Buttons', 'Zippers', 'Fabric patches', 'Threads'],
    WomensClothing: ['Buttons', 'Zippers', 'Threads', 'Hooks'],
    KidsClothing: ['Buttons', 'Zippers', 'Fabric patches', 'Elastic bands'],
    Accessories: ['Buckles', 'Clasps', 'Hooks', 'Chains'],
    Footwear: ['Soles', 'Insoles', 'Laces', 'Heel caps'],
    Activewear: ['Zippers', 'Elastic bands', 'Drawstrings'],
    Outerwear: ['Buttons', 'Zippers', 'Lining fabric', 'Toggles'],
    Swimwear: ['Elastic bands', 'Hooks', 'Padding'],
    Sleepwear: ['Buttons', 'Zippers', 'Elastic bands'],
    PlusSize: ['Buttons', 'Zippers', 'Elastic bands', 'Fabric patches'],
    Maternity: ['Elastic bands', 'Zippers', 'Fabric patches'],
    Uniforms: ['Buttons', 'Zippers', 'Patches', 'Hooks']
  },
  'Home & Kitchen': {
    Furniture: ['Screws', 'Bolts', 'Nuts', 'Hinges', 'Drawer slides'],
    Cookware: ['Handles', 'Lids', 'Screws', 'Non-stick coating'],
    Decor: ['Hooks', 'Hanging wires', 'Nails', 'Screws'],
    Appliances: ['Heating elements', 'Knobs', 'Switches', 'Fans', 'Filters'],
    Bedding: ['Zippers', 'Buttons', 'Fabric patches'],
    StorageSolutions: ['Hinges', 'Latches', 'Screws', 'Casters'],
    OutdoorFurniture: ['Screws', 'Bolts', 'Fabric', 'Paint', 'Wood finish'],
    Lighting: ['Bulbs', 'Wiring', 'Switches', 'Sockets'],
    GardenTools: ['Blades', 'Handles', 'Screws', 'Bolts'],
    CleaningSupplies: ['Nozzles', 'Brushes', 'Pads', 'Refills'],
    KitchenStorage: ['Hinges', 'Handles', 'Screws', 'Drawer slides'],
    SmallKitchenAppliances: ['Blades', 'Gaskets', 'Buttons', 'Power cords'],
    Barware: ['Corkscrews', 'Stoppers', 'Pour spouts', 'Shakers']
  },
  Books: {
    Fiction: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    NonFiction: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    Educational: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    ChildrensBooks: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    ComicsGraphicNovels: ['Protective sleeves', 'Binding glue', 'Pages (for restoration)'],
    Cookbooks: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    SelfHelp: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    Biographies: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    ScienceFictionFantasy: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    History: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    Romance: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    Travel: ['Book covers', 'Binding glue', 'Pages (for restoration)'],
    Cookery: ['Book covers', 'Binding glue', 'Pages (for restoration)']
  },
  'Health & Beauty': {
    Skincare: ['Dispenser pumps', 'Jars', 'Spatulas', 'Tubes'],
    Haircare: ['Nozzles', 'Caps', 'Brushes', 'Comb teeth'],
    PersonalCare: ['Razor blades', 'Battery compartments', 'Shaver heads'],
    VitaminsSupplements: ['Bottles', 'Caps', 'Labels', 'Seals'],
    Makeup: ['Brushes', 'Sponges', 'Compacts', 'Mirror replacements'],
    Fragrances: ['Spray nozzles', 'Caps', 'Bottles'],
    FitnessEquipment: ['Weights', 'Bands', 'Cables', 'Handles'],
    OralCare: ['Toothbrush heads', 'Floss dispensers', 'Refills'],
    MensGrooming: ['Shaving blades', 'Grooming heads', 'Combs'],
    BodyCare: ['Dispenser pumps', 'Caps', 'Jars', 'Tubes'],
    HairTools: ['Hair dryers', 'Straighteners', 'Curling irons', 'Brushes'],
    HealthMonitors: ['Batteries', 'Screens', 'Sensors'],
    Wellness: ['Massagers', 'Pill organizers', 'Heating pads']
  },
  'Toys & Games': {
    ActionFigures: ['Articulation joints', 'Accessories', 'Replacement parts'],
    BoardGames: ['Game pieces', 'Cards', 'Dice', 'Boards'],
    EducationalToys: ['Batteries', 'Sensors', 'Buttons', 'Instructional materials'],
    Dolls: ['Clothing', 'Hair', 'Accessories', 'Replacement parts'],
    OutdoorPlay: ['Balls', 'Inflatable parts', 'Playground equipment parts'],
    BuildingToys: ['Blocks', 'Connector pieces', 'Instruction manuals'],
    Puzzles: ['Pieces', 'Boxes', 'Instruction manuals'],
    PretendPlay: ['Costumes', 'Props', 'Accessories'],
    RemoteControl: ['Batteries', 'Controllers', 'Parts for repairs'],
    RideOns: ['Wheels', 'Battery packs', 'Chargers', 'Safety belts'],
    ArtsCrafts: ['Art supplies', 'Crafting tools', 'Instructional materials'],
    ElectronicToys: ['Batteries', 'Circuit boards', 'Controllers', 'Parts'],
    STEMToys: ['Sensors', 'Batteries', 'Building parts', 'Instruction manuals']
  },
  'Sports & Outdoors': {
    CampingHiking: ['Tents', 'Sleeping bags', 'Cooking gear', 'Backpacks'],
    FitnessExercise: ['Weights', 'Exercise bands', 'Yoga mats', 'Resistance bands'],
    SportsEquipment: ['Balls', 'Bats', 'Protective gear', 'Accessories'],
    Cycling: ['Bikes', 'Helmets', 'Batteries', 'Repair kits'],
    Fishing: ['Rods', 'Reels', 'Lures', 'Bait'],
    WaterSports: ['Boards', 'Paddles', 'Wetsuits', 'Safety equipment'],
    WinterSports: ['Skis', 'Snowboards', 'Boots', 'Poles'],
    Running: ['Shoes', 'Watches', 'Running belts', 'Hydration packs'],
    OutdoorFurniture: ['Cushions', 'Frames', 'Hardware', 'Maintenance supplies'],
    SportsApparel: ['Apparel', 'Accessories', 'Protective gear'],
    YogaPilates: ['Mats', 'Blocks', 'Straps', 'Resistance bands'],
    ClimbingGear: ['Harnesses', 'Carabiners', 'Ropes', 'Climbing shoes'],
    Golf: ['Clubs', 'Balls', 'Tees', 'Bags']
  },
  Automotive: {
    CarElectronics: ['Head units', 'Speakers', 'Wiring harnesses', 'Mounting brackets'],
    InteriorAccessories: ['Floor mats', 'Seat covers', 'Dashboard components'],
    ExteriorAccessories: ['Spoilers', 'Grilles', 'Mud flaps', 'Roof racks'],
    ToolsEquipment: ['Wrenches', 'Jacks', 'Diagnostic tools', 'Repair kits'],
    CarCare: ['Cleaning products', 'Wax', 'Polish', 'Detailing supplies'],
    ReplacementParts: ['Brakes', 'Filters', 'Belts', 'Hoses'],
    MotorcyclesATVs: ['Tires', 'Battery packs', 'Brakes', 'Handlebars'],
    CarSafety: ['Airbags', 'Seat belts', 'Safety sensors', 'Cameras'],
    AutoDetailing: ['Cleaning products', 'Polishes', 'Cloths', 'Brushes'],
    TruckAccessories: ['Bed liners', 'Tow hooks', 'Running boards', 'Toolboxes'],
    CarCovers: ['Cover materials', 'Fasteners', 'Storage bags'],
    TowingEquipment: ['Hitches', 'Tow bars', 'Safety chains', 'Winches'],
    CarLighting: ['Headlights', 'Tail lights', 'Fog lights', 'Bulbs']
  },
  'Office Supplies': {
    Furniture: ['Screws', 'Bolts', 'Nuts', 'Hinges', 'Drawer slides'],
    Stationery: ['Pens', 'Notebooks', 'Staplers', 'Paper clips'],
    PrinterSupplies: ['Ink cartridges', 'Toner', 'Drum units', 'Paper trays'],
    OfficeElectronics: ['Monitors', 'Keyboards', 'Mice', 'Cables'],
    Organization: ['Binders', 'Folders', 'Label makers', 'Desk organizers'],
    OfficeDecor: ['Picture frames', 'Desk lamps', 'Plants', 'Wall art'],
    DesksChairs: ['Casters', 'Armrests', 'Desks components', 'Chair cushions'],
    MailingSupplies: ['Envelopes', 'Packaging tape', 'Mailing labels', 'Boxes'],
    BreakroomSupplies: ['Coffee makers', 'Microwaves', 'Cutlery', 'Disposables'],
    CalendarsPlanners: ['Calendar pages', 'Planner inserts', 'Pens', 'Desk organizers'],
    FilingStorage: ['File folders', 'Filing cabinets', 'Drawer dividers', 'Labels'],
    Whiteboards: ['Markers', 'Erasers', 'Mounting hardware', 'Cleaning solutions'],
    PresentationSupplies: ['Projectors', 'Screen stands', 'Remote clickers', 'Flip charts']
  },
  'Pet Supplies': {
    DogSupplies: ['Leashes', 'Collars', 'Food bowls', 'Grooming tools'],
    CatSupplies: ['Litter boxes', 'Scratching posts', 'Food bowls', 'Grooming tools'],
    BirdSupplies: ['Cages', 'Perches', 'Food dishes', 'Toys'],
    FishSupplies: ['Aquariums', 'Filters', 'Heaters', 'Food'],
    SmallAnimalSupplies: ['Cages', 'Bedding', 'Food dishes', 'Toys'],
    PetFurniture: ['Beds', 'Crates', 'Cat trees', 'Dog houses'],
    PetHealth: ['Medications', 'Supplements', 'Health monitors'],
    Grooming: ['Shampoos', 'Brushes', 'Nail clippers', 'Grooming tools'],
    TrainingBehavior: ['Training collars', 'Clickers', 'Training guides'],
    PetTravel: ['Carriers', 'Travel bowls', 'Seat covers', 'Safety harnesses'],
    AquariumSupplies: ['Filters', 'Heaters', 'Lighting', 'Food'],
    ReptileSupplies: ['Cages', 'Heating lamps', 'Substrate', 'Food'],
    PetApparel: ['Coats', 'Boots', 'Hats', 'Costumes']
  },
  'Garden & Outdoor': {
    Plants: ['Soil', 'Pots', 'Fertilizers', 'Watering cans'],
    GardenTools: ['Shovels', 'Rakes', 'Pruners', 'Trowels'],
    OutdoorFurniture: ['Cushions', 'Frames', 'Hardware', 'Maintenance supplies'],
    GrillsOutdoorCooking: ['Grill grates', 'Burners', 'Heat shields', 'Ignition components'],
    PlantersPots: ['Potting mix', 'Planters', 'Pot feet', 'Drill bits'],
    OutdoorLighting: ['Bulbs', 'Fixtures', 'Cables', 'Mounting hardware'],
    Fencing: ['Panels', 'Posts', 'Gates', 'Fasteners'],
    GardeningSupplies: ['Gloves', 'Pruners', 'Trowels', 'Watering cans'],
    OutdoorDecor: ['Wind chimes', 'Garden statues', 'Lights', 'Planters'],
    Landscaping: ['Soil', 'Mulch', 'Edging', 'Plants'],
    WaterFeatures: ['Pumps', 'Filters', 'Fountains', 'Lighting'],
    OutdoorHeating: ['Heaters', 'Patio warmers', 'Fuel tanks', 'Safety covers'],
    PatioFurniture: ['Cushions', 'Frames', 'Hardware', 'Maintenance supplies']
  },
  'Jewelry & Watches': {
    NecklacesPendants: ['Chains', 'Clasps', 'Settings', 'Charms'],
    Earrings: ['Backs', 'Hooks', 'Posts', 'Settings'],
    Bracelets: ['Links', 'Clasps', 'Charms', 'Adjusters'],
    Rings: ['Settings', 'Bands', 'Resizing tools', 'Gemstones'],
    Watches: ['Straps', 'Batteries', 'Movements', 'Crown'],
    BroochesPins: ['Clasp backs', 'Pins', 'Settings', 'Decorative elements'],
    MensJewelry: ['Bands', 'Cufflinks', 'Tie clips', 'Bracelets'],
    JewelrySets: ['Matching components', 'Storage cases', 'Cleaning cloths'],
    JewelryCareStorage: ['Boxes', 'Cleaning solutions', 'Anti-tarnish pouches'],
    EngagementWedding: ['Rings', 'Settings', 'Boxes', 'Cleaning supplies'],
    LuxuryWatches: ['Movements', 'Straps', 'Batteries', 'Bezel'],
    FashionJewelry: ['Chains', 'Clasps', 'Beads', 'Settings'],
    CustomJewelry: ['Custom settings', 'Gemstones', 'Engraving tools']
  },
  'Arts & Crafts': {
    DrawingPainting: ['Pencils', 'Brushes', 'Canvas', 'Easels'],
    CraftSupplies: ['Glue', 'Scissors', 'Paper', 'Markers'],
    SewingKnitting: ['Needles', 'Yarn', 'Patterns', 'Fabric'],
    BeadingJewelryMaking: ['Beads', 'Wires', 'Clasps', 'Tools'],
    Scrapbooking: ['Stickers', 'Paper', 'Adhesives', 'Tools'],
    ModelBuilding: ['Glue', 'Tools', 'Paint', 'Model kits'],
    ArtSupplies: ['Paints', 'Brushes', 'Canvas', 'Palettes'],
    FabricTextiles: ['Fabrics', 'Thread', 'Needles', 'Patterns'],
    CraftKits: ['Instructions', 'Materials', 'Tools'],
    PaintingTools: ['Brushes', 'Palettes', 'Easels', 'Canvas'],
    DIYProjects: ['Materials', 'Tools', 'Instructions'],
    ArtStorage: ['Portfolio cases', 'Storage boxes', 'Protective sleeves'],
    CraftTools: ['Cutting tools', 'Adhesives', 'Measuring tools']
  },
  'Musical Instruments': {
    Guitars: ['Strings', 'Pickups', 'Frets', 'Tuners'],
    PianosKeyboards: ['Keys', 'Hammers', 'Pedals', 'Cables'],
    Drums: ['Drum heads', 'Sticks', 'Cymbals', 'Hardware'],
    OrchestralInstruments: ['Strings', 'Reeds', 'Mouthpieces', 'Rosin'],
    WindInstruments: ['Mouthpieces', 'Reeds', 'Valves', 'Pads'],
    ElectronicInstruments: ['Cables', 'Power supplies', 'Pads', 'Controllers'],
    RecordingEquipment: ['Microphones', 'Cables', 'Audio interfaces', 'Mixers'],
    Accessories: ['Cases', 'Straps', 'Picks', 'Tuners'],
    SheetMusic: ['Sheets', 'Folders', 'Music stands'],
    Amplifiers: ['Tubes', 'Speakers', 'Cables', 'Controls'],
    InstrumentCare: ['Cleaning cloths', 'Polish', 'Lubricants', 'Tools'],
    Microphones: ['Mic stands', 'Cables', 'Windshields', 'Shock mounts'],
    DJEquipment: ['Turntables', 'Controllers', 'Headphones', 'Cables']
  },
  'Baby Products': {
    Clothing: ['Buttons', 'Zippers', 'Fabric patches', 'Elastic bands'],
    DiapersWipes: ['Diaper fasteners', 'Wipes refills', 'Disposal bags'],
    Feeding: ['Bottles', 'Nipples', 'Warmers', 'Sterilizers'],
    NurseryFurniture: ['Mattresses', 'Drawer slides', 'Safety rails', 'Bumpers'],
    Toys: ['Batteries', 'Replacement parts', 'Toys accessories'],
    BabyGear: ['Car seats', 'Strollers', 'Diaper bags', 'Baby carriers'],
    HealthSafety: ['Thermometers', 'Medicine dispensers', 'Safety locks'],
    Bedding: ['Mattresses', 'Sheets', 'Pillows', 'Blankets'],
    TravelGear: ['Carriers', 'Travel beds', 'Portable high chairs'],
    Bath: ['Bath toys', 'Baby shampoo', 'Bath mats', 'Towels'],
    CarSeats: ['Harnesses', 'Bases', 'Covers', 'Adjusters'],
    BabyMonitors: ['Cameras', 'Monitors', 'Mounting hardware', 'Power adapters'],
    SwingsBouncers: ['Harnesses', 'Seat pads', 'Batteries', 'Power adapters']
  },
  'Food & Beverage': {
    Snacks: ['Packaging', 'Labels', 'Food trays', 'Containers'],
    Beverages: ['Bottles', 'Caps', 'Straws', 'Filters'],
    Groceries: ['Packaging', 'Seals', 'Labels', 'Containers'],
    GourmetFoods: ['Packaging', 'Labels', 'Containers'],
    HealthFoods: ['Packaging', 'Labels', 'Containers'],
    SpecialtyFoods: ['Packaging', 'Labels', 'Containers'],
    Organic: ['Packaging', 'Labels', 'Containers'],
    AlcoholicBeverages: ['Bottles', 'Caps', 'Labels', 'Packaging'],
    CookingIngredients: ['Containers', 'Labels', 'Packaging'],
    SaucesCondiments: ['Bottles', 'Caps', 'Labels', 'Packaging'],
    BakingSupplies: ['Containers', 'Labels', 'Packaging'],
    MealKits: ['Ingredients', 'Packaging', 'Labels', 'Instructions'],
    CoffeeTea: ['Beans', 'Filters', 'Capsules', 'Packaging']
  },
  'Industrial & Scientific': {
    LabEquipment: ['Beakers', 'Flasks', 'Pipettes', 'Test tubes'],
    IndustrialTools: ['Wrenches', 'Drills', 'Saw blades', 'Pliers'],
    SafetyEquipment: ['Helmets', 'Gloves', 'Goggles', 'Masks'],
    ScientificInstruments: ['Microscopes', 'Spectrometers', 'Centrifuges', 'Balances'],
    CleaningSupplies: ['Mops', 'Buckets', 'Cleaning agents', 'Scrub brushes'],
    OfficeSupplies: ['Printers', 'Shredders', 'Paper', 'Staplers'],
    MaterialHandling: ['Carts', 'Hoists', 'Pallets', 'Forklifts'],
    MeasuringTesting: ['Calipers', 'Thermometers', 'Multimeters', 'Micrometers'],
    HVAC: ['Air filters', 'Thermostats', 'Fans', 'Ducts'],
    WorkplaceSafety: ['Fire extinguishers', 'First aid kits', 'Safety signs', 'Emergency lights'],
    ConstructionSupplies: ['Concrete', 'Rebar', 'Nails', 'Sealants'],
    IndustrialLighting: ['High-bay lights', 'Floodlights', 'Ballasts', 'LED modules'],
    PumpsValves: ['Pump seals', 'Valves', 'Hoses', 'Gaskets']
  },
  Travel: {
    Luggage: ['Suitcases', 'Travel bags', 'Locks', 'Luggage tags'],
    TravelAccessories: ['Travel pillows', 'Eye masks', 'Luggage straps', 'Adapters'],
    TravelClothing: ['Raincoats', 'Travel pants', 'Comfortable shoes', 'Layers'],
    OutdoorGear: ['Tents', 'Sleeping bags', 'Camping stoves', 'Backpacks'],
    TravelGuides: ['Maps', 'Travel books', 'Guides', 'Local tips'],
    Electronics: ['Chargers', 'Headphones', 'Portable batteries', 'Adapters'],
    TravelBags: ['Daypacks', 'Duffel bags', 'Toiletry bags', 'Laptop sleeves'],
    TravelToiletries: ['Shampoo', 'Toothpaste', 'Soap', 'Travel bottles'],
    CampingEquipment: ['Camping chairs', 'Tents', 'Cooking gear', 'Lanterns'],
    TravelHealth: ['First aid kits', 'Medication', 'Insect repellent', 'Sunscreen'],
    TravelOrganizers: ['Passport holders', 'Travel wallets', 'Packing cubes', 'Document organizers'],
    TravelSecurity: ['Locks', 'Security pouches', 'Anti-theft backpacks', 'RFID-blocking sleeves'],
    TravelPillows: ['Neck pillows', 'Lumbar pillows', 'Inflatable pillows', 'Memory foam pillows']
  },
  Furniture: {
    LivingRoomFurniture: ['Sofas', 'Coffee tables', 'TV stands', 'Bookshelves'],
    BedroomFurniture: ['Beds', 'Dressers', 'Nightstands', 'Wardrobes'],
    OfficeFurniture: ['Desks', 'Chairs', 'File cabinets', 'Bookcases'],
    OutdoorFurniture: ['Patio chairs', 'Tables', 'Umbrellas', 'Loungers'],
    StorageOrganization: ['Shelves', 'Closet organizers', 'Storage bins', 'Hooks'],
    DiningRoomFurniture: ['Dining tables', 'Chairs', 'Buffets', 'China cabinets'],
    KidsFurniture: ['Bunk beds', 'Toy chests', 'Kid-sized tables', 'Bookshelves'],
    FurnitureSets: ['Bedroom sets', 'Living room sets', 'Office sets', 'Dining sets'],
    Mattresses: ['Memory foam', 'Innerspring', 'Pillow-top', 'Hybrid'],
    AccentFurniture: ['End tables', 'Ottomans', 'Console tables', 'Accent chairs'],
    HomeOfficeFurniture: ['Desks', 'Office chairs', 'Storage solutions', 'Lighting'],
    FurnitureAccessories: ['Cushions', 'Slipcovers', 'Decorative pillows', 'Furniture pads']
  },
  Hobbies: {
    ModelTrains: ['Track pieces', 'Engines', 'Cars', 'Scenery'],
    RCVehicles: ['Batteries', 'Chargers', 'Remote controllers', 'Replacement parts'],
    Drones: ['Propellers', 'Batteries', 'Gimbals', 'Cases'],
    Collectibles: ['Display cases', 'Protective sleeves', 'Cleaning kits', 'Catalogs'],
    Puzzles: ['Puzzle pieces', 'Frames', 'Sorting trays', 'Glue'],
    BoardGames: ['Game pieces', 'Boards', 'Dice', 'Instruction manuals'],
    CraftKits: ['Materials', 'Instructions', 'Tools', 'Storage cases'],
    HobbyTools: ['Cutting mats', 'Craft knives', 'Tweezers', 'Glue guns'],
    KitsSupplies: ['Materials', 'Instructions', 'Tools', 'Storage'],
    Gardening: ['Seeds', 'Soil', 'Tools', 'Watering cans'],
    BirdWatching: ['Binoculars', 'Field guides', 'Bird feeders', 'Cameras'],
    Fishing: ['Rods', 'Reels', 'Lures', 'Tackle boxes']
  }
};
export default repairParts;
