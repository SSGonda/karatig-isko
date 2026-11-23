export type Listing = {
	id: number;
	name: string;
	location: string;
	area: string;
	rent: number;
	perRoom: number;
	privateCR: boolean;
	wifi: boolean;
	water: boolean;
	electricity: boolean;
	image: string;
	rating: number;
	reviews: number;
	verified: boolean;
	furnished: boolean;
	available: string;
	seller: string;
	sellerInitials: string;
	description: string;
};

const locations = [
	'UP Campus, Diliman',
	'Katipunan Avenue',
	'UP Village',
	'Barangay Krus Na Ligas',
	'U.P. Teachers Village',
	'Magsaysay Avenue',
	'Roces Avenue',
	'Commonwealth Avenue',
	'Philcoa',
	'Sikatuna Village'
] as const;

const names = [
	'Isko Haven',
	'Sunview Residences',
	'Diliman Nest',
	'Magsaysay Place',
	'Treeside Studio',
	'Balay Silangan',
	'Campus Corner',
	'The Green Room',
	'U.P. Sanctuary',
	'Tambayan Suites',
	'Krus na Ligas Loft',
	'Katipunan Kasa',
	'Acacia Place',
	'Mariposa Residences',
	'Scholar House'
] as const;

const images = [
	'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85',
	'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=85'
] as const;

export const listings: Listing[] = Array.from({ length: 100 }, (_, i) => {
	const quality = i % 5;
	const rentBase = [5200, 6500, 8200, 10500, 13500][quality];
	const rent = rentBase + ((i * 250) % 3000);
	const location = locations[i % locations.length];
	const sellerNames = ['Maria Santos', 'Jun Ramirez', 'Ana Dela Cruz', 'Carlo Mendoza', 'Jessa Lim'];
	const seller = sellerNames[i % sellerNames.length];

	return {
		id: i + 1,
		name: `${names[i % names.length]} ${i % 2 === 0 ? '' : 'Studios'} ${i + 1}`,
		location,
		area: `${[6, 8, 10, 14, 18][quality]} sqm`,
		rent,
		perRoom: i % 7 === 0 ? 1 : i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 4,
		privateCR: i % 4 !== 1,
		wifi: i % 5 !== 2,
		water: i % 11 !== 4,
		electricity: i % 13 !== 6,
		image: images[i % images.length],
		rating: Number((4.1 + ((i * 7) % 9) / 10).toFixed(1)),
		reviews: 8 + ((i * 13) % 74),
		verified: i % 6 !== 0,
		furnished: i % 3 !== 1,
		available: i % 8 === 0 ? 'Available now' : `${1 + (i % 4)} weeks`,
		seller,
		sellerInitials: seller.split(' ').map((part) => part[0]).join(''),
		description: `Well-kept ${i % 3 === 0 ? 'bedroom' : 'room'} near ${location}, convenient for UP Diliman students.`
	};
});
