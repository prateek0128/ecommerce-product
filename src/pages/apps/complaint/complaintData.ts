const complaintData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 1,
    description: 'The toaster stopped working after a week of use.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    avatar: 2,
    description: 'The remote control for the TV does not respond.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    avatar: 3,
    description: 'The washing machine makes a loud noise during spin cycle.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 4,
    name: 'Diana Evans',
    email: 'diana.evans@example.com',
    avatar: 4,
    description: 'The blender leaked from the bottom while blending.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 5,
    name: 'Ethan Davis',
    email: 'ethan.davis@example.com',
    avatar: 5,
    description: 'The refrigerator is not cooling properly.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 6,
    name: 'Fiona Garcia',
    email: 'fiona.garcia@example.com',
    avatar: 1,
    description: 'The coffee maker does not brew the coffee.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 7,
    name: 'George Harris',
    email: 'george.harris@example.com',
    avatar: 2,
    description: 'The air conditioner blows hot air instead of cold.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 8,
    name: 'Hannah Clark',
    email: 'hannah.clark@example.com',
    avatar: 3,
    description: 'The microwave sparks when in use.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 9,
    name: 'Ian Lewis',
    email: 'ian.lewis@example.com',
    avatar: 4,
    description: 'The dishwasher leaves dishes dirty after washing.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 10,
    name: 'Julia Martinez',
    email: 'julia.martinez@example.com',
    avatar: 5,
    description: 'The vacuum cleaner has low suction power.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 11,
    name: 'Kevin Wilson',
    email: 'kevin.wilson@example.com',
    avatar: 1,
    description: 'The oven does not heat up properly.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 12,
    name: 'Laura Moore',
    email: 'laura.moore@example.com',
    avatar: 2,
    description: 'The ceiling fan makes a rattling noise.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 13,
    name: 'Michael Taylor',
    email: 'michael.taylor@example.com',
    avatar: 3,
    description: 'The refrigerator’s freezer is not defrosting.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 14,
    name: 'Nina Anderson',
    email: 'nina.anderson@example.com',
    avatar: 4,
    description: 'The hair dryer overheats and shuts off.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 15,
    name: 'Oliver Thompson',
    email: 'oliver.thompson@example.com',
    avatar: 5,
    description: 'The dishwasher leaks water.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 16,
    name: 'Paul White',
    email: 'paul.white@example.com',
    avatar: 1,
    description: 'The iron does not heat up at all.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 17,
    name: 'Quinn Robinson',
    email: 'quinn.robinson@example.com',
    avatar: 2,
    description: 'The TV screen is flickering intermittently.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 18,
    name: 'Rachel Walker',
    email: 'rachel.walker@example.com',
    avatar: 3,
    description: 'The washing machine does not spin properly.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 19,
    name: 'Samuel Young',
    email: 'samuel.young@example.com',
    avatar: 4,
    description: 'The air fryer does not cook evenly.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 20,
    name: 'Tina Allen',
    email: 'tina.allen@example.com',
    avatar: 5,
    description: 'The electric stove’s burner does not light.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 21,
    name: 'Ulysses King',
    email: 'ulysses.king@example.com',
    avatar: 1,
    description: 'The blender motor is not working.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 22,
    name: 'Vanessa Scott',
    email: 'vanessa.scott@example.com',
    avatar: 2,
    description: 'The refrigerator makes a loud humming noise.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 23,
    name: 'Willie Wright',
    email: 'willie.wright@example.com',
    avatar: 3,
    description: 'The toaster burns the bread unevenly.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 24,
    name: 'Xena Green',
    email: 'xena.green@example.com',
    avatar: 4,
    description: 'The electric kettle leaks water.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 25,
    name: 'Yusuf Adams',
    email: 'yusuf.adams@example.com',
    avatar: 5,
    description: 'The air conditioner makes a whistling sound.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 26,
    name: 'Zoe Nelson',
    email: 'zoe.nelson@example.com',
    avatar: 1,
    description: 'The microwave’s turntable is not rotating.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 27,
    name: 'Aaron Carter',
    email: 'aaron.carter@example.com',
    avatar: 2,
    description: 'The coffee maker leaks water during brewing.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 28,
    name: 'Bella Perry',
    email: 'bella.perry@example.com',
    avatar: 3,
    description: 'The toaster does not pop up the toast.',
    inWarranty: 'No',
    status: 'Pending'
  },
  {
    id: 29,
    name: 'Carlos Mitchell',
    email: 'carlos.mitchell@example.com',
    avatar: 4,
    description: 'The ceiling fan’s light is flickering.',
    inWarranty: 'Yes',
    status: 'Completed'
  },
  {
    id: 30,
    name: 'Daisy Howard',
    email: 'daisy.howard@example.com',
    avatar: 5,
    description: 'The washing machine is leaking from the bottom.',
    inWarranty: 'No',
    status: 'Pending'
  }
];

export default complaintData;
