/**
 * Institutional clients — rendered in the marquee and the modal gallery.
 * `logo` is a filename in /public/images. `category` drives the modal filter:
 *   'academic'  -> Academic & Training
 *   'corporate' -> Corporate & Government
 */
export const clients = [
  { name: 'IIM Sambalpur', logo: 'iim_sambalpur.svg', category: 'academic' },
  { name: 'IIM Visakhapatnam', logo: 'iim_visakhapatnam.webp', category: 'academic' },
  { name: 'Christ University', logo: 'christ_university.webp', category: 'academic' },
  { name: 'ISBF', logo: 'isbf.webp', category: 'academic' },
  { name: 'NIIT', logo: 'niit.webp', category: 'academic' },
  { name: 'Great Learning', logo: 'great_learning.webp', category: 'academic' },
  { name: 'Imarticus', logo: 'imarticus.webp', category: 'academic' },
  { name: 'IMS Proschool', logo: 'ims_proschool.webp', category: 'academic' },
  { name: 'EduEdge Pro', logo: 'eduedgepro.webp', category: 'academic' },
  { name: 'Room to Read', logo: 'room_to_read.webp', category: 'academic' },
  { name: 'EY', logo: 'ey_logo.webp', category: 'corporate' },
  { name: 'Hexaware', logo: 'hexaware.webp', category: 'corporate' },
  { name: 'Havells', logo: 'havells.svg', category: 'corporate' },
  { name: 'Colt', logo: 'colt.webp', category: 'corporate' },
  { name: 'Bennett & Coleman', logo: 'bennet_coleman.webp', category: 'corporate' },
  { name: 'AJNIFM', logo: 'ajnifm.webp', category: 'corporate' },
];

export const clientFilters = [
  { id: 'all', label: 'All' },
  { id: 'academic', label: 'Academic & Training' },
  { id: 'corporate', label: 'Corporate & Government' },
];
