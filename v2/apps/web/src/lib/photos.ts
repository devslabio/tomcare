const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=85`;

/** Photography for fixed sections of the site. Content photos (programs, events, news) are managed in the admin. */
export const photos = {
  hero: photo("1643818650011-93880bbe1ec2"),
  arrival: photo("1560346740-a8678c61a524"),
  community: photo("1609260840244-22b52bfc6664"),
  family: photo("1577896849786-738ed6c78bd3"),
  mother: photo("1679108853755-10a20562ec61"),
  seniors: photo("1666885181679-b7f6f6e8690f"),
  wheelchair: photo("1662320152920-a1042515cfea"),
  familyUnpacking: photo("1586637461012-60681f63289c"),
  newHome: photo("1590464216822-9342156321f2"),
  volunteer: photo("1560220604-1985ebfe28b1"),
  handsTogether: photo("1655720359248-eeace8c709c5"),
  familyOutdoors: photo("1592599457566-c660153d9548"),
  mentoring: photo("1758525226597-6263703aca5f"),
  teamMeeting: photo("1653566031535-bcf33e1c2893"),
  dinner: photo("1731475761027-0b6b33b74547"),
  friends: photo("1650523616477-c0b945a43c1c"),
  sharedMeal: photo("1683549200177-e60855969f29"),
  winter: photo("1545885785-910f3bbf07a8"),
  familyHome: photo("1737649073335-6d0d683fae81"),
};
