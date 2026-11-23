<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { listings } from '#lib/data/listings.js';
	import { onMount } from 'svelte';
	import {
		Bath,
		Bolt,
		ChevronDown,
		Clock,
		Droplets,
		Heart,
		MapPin,
		Minus,
		Plus,
		Search,
		SlidersHorizontal,
		Star,
		Users,
		Wifi
	} from '@lucide/svelte';

	let search = $state('');
	let location = $state('Anywhere');
	let maxRent = $state(15000);
	let perRoom = $state(2);
	let privateCR = $state(false);
	let wifi = $state(false);
	let water = $state(false);
	let electricity = $state(false);
	let saved = $state<number[]>([3, 12, 28]);
	let visibleCount = $state(24);
	let routeDetails = $state<Record<string, { distance: string; duration: string }>>({});

	const upDiliman = { lat: 14.6549, lng: 121.0649 };
	const locationCoordinates: Record<string, { lat: number; lng: number }> = {
		'UP Campus, Diliman': { lat: 14.6535, lng: 121.0682 },
		'Katipunan Avenue': { lat: 14.6507, lng: 121.0735 },
		'UP Village': { lat: 14.6485, lng: 121.0652 },
		'Barangay Krus Na Ligas': { lat: 14.6448, lng: 121.0661 },
		'U.P. Teachers Village': { lat: 14.6428, lng: 121.0686 },
		'Magsaysay Avenue': { lat: 14.6571, lng: 121.0669 },
		'Roces Avenue': { lat: 14.6421, lng: 121.0391 },
		'Commonwealth Avenue': { lat: 14.6951, lng: 121.0759 },
		'Philcoa': { lat: 14.6549, lng: 121.0488 },
		'Sikatuna Village': { lat: 14.6388, lng: 121.0598 }
	};

	onMount(() => {
		const uniqueLocations = [...new Set(listings.map((listing) => listing.location))];

		void Promise.all(uniqueLocations.map(async (location) => {
			const origin = locationCoordinates[location];
			if (!origin) return;

			try {
				const response = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${upDiliman.lng},${upDiliman.lat}?overview=false`
				);
				if (!response.ok) return;

				const data = await response.json();
				const route = data.routes?.[0];
				if (!route) return;

				const distanceKm = route.distance / 1000;
				const durationMinutes = Math.ceil(route.duration / 60);
				routeDetails = {
					...routeDetails,
					[location]: {
						distance: distanceKm < 10 ? `${distanceKm.toFixed(1)} km` : `${Math.round(distanceKm)} km`,
						duration: durationMinutes < 60
							? `${durationMinutes} min`
							: `${Math.floor(durationMinutes / 60)} hr ${durationMinutes % 60} min`
					}
				};
			} catch {
				// Route details remain unavailable if the public routing service is unreachable.
			}
		}));
	});

	let filtered = $derived(listings.filter((listing) => {
		const searchMatch = `${listing.name} ${listing.location}`.toLowerCase().includes(search.toLowerCase());
		const locationMatch = location === 'Anywhere' || listing.location.includes(location);
		const roomMatch = listing.perRoom === perRoom;
		return searchMatch && locationMatch && listing.rent <= maxRent && roomMatch
			&& (!privateCR || listing.privateCR)
			&& (!wifi || listing.wifi)
			&& (!water || listing.water)
			&& (!electricity || listing.electricity);
	}));

	function toggleSaved(id: number) {
		saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
	}
</script>

<main>
	<section class="border-b border-[#dde3dc] bg-[#eef3ed]">
		<div class="mx-auto max-w-360 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<div class="max-w-2xl">
				<p class="mb-3 text-xs font-black uppercase text-[#176b4d]">Para sa bayan.</p>
				<h1 class="text-4xl font-black tracking-tight text-[#18231d] sm:text-5xl">Affordable. Safe.</h1>
				<p class="mt-4 max-w-xl text-base leading-7 text-[#68766e]">For students by students, safe and verified housing near campus from shared rooms to studio units.</p>
			</div>

			<div class="mt-8 grid gap-3 rounded-2xl border border-white bg-white p-3 shadow-[0_14px_40px_rgba(42,70,54,0.10)] lg:grid-cols-[1.5fr_1fr_1fr_auto]">
				<label class="relative">
					<span class="sr-only">Search</span>
					<Search class="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8a968f]" />
					<Input bind:value={search} placeholder="Search area or unit name" class="h-12 rounded-xl border-[#dde3dc] pl-11" />
				</label>
				<label class="relative">
					<span class="sr-only">Location</span>
					<MapPin class="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8a968f]" />
					<select bind:value={location} class="h-12 w-full appearance-none rounded-xl border border-[#dde3dc] bg-white pl-11 pr-9 text-sm font-semibold outline-none">
						<option>Anywhere</option>
						<option>UP Campus</option>
						<option>UP Village</option>
						<option>Katipunan Avenue</option>
						<option>Magsaysay Avenue</option>
						<option>Philcoa</option>
					</select>
					<ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8a968f]" />
				</label>
				<div class="flex h-12 items-center gap-3 rounded-xl border border-[#dde3dc] bg-white px-3">
					<label class="shrink-0 text-xs font-bold text-[#68766e]" for="rent-limit">
						Rent (₱)
					</label>
					<input
						id="rent-limit"
						type="number"
						min="3000"
						max="15000"
						step="250"
						value={maxRent}
						oninput={(event) => maxRent = Math.min(15000, Math.max(3000, Number(event.currentTarget.value) || 3000))}
						class="h-8 w-[88px] rounded-md border border-[#dde3dc] bg-[#f7f8f6] px-2 text-sm font-bold outline-none"
					/>
					<input
						type="range"
						min="3000"
						max="15000"
						step="250"
						bind:value={maxRent}
						aria-label="Maximum monthly rent"
						class="h-2 min-w-20 flex-1 cursor-pointer accent-[#176b4d]"
					/>
				</div>
				<Button class="h-12 rounded-xl bg-[#176b4d] px-6 font-bold hover:bg-[#12583f]" onclick={() => visibleCount = 24}>
					<Search class="mr-2 size-4" /> Search
				</Button>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
		<div class="mb-6 flex flex-col gap-4 border-b border-[#dde3dc] pb-5 xl:flex-row xl:items-center xl:justify-between">
			<div class="flex flex-wrap items-center gap-2">
				<span class="mr-1 flex items-center gap-2 text-sm font-bold"><SlidersHorizontal class="size-4" /> Filters</span>
				<label class="flex h-9 items-center gap-2 rounded-full border border-[#dde3dc] bg-white px-3 text-sm">
					<input type="checkbox" bind:checked={privateCR} class="accent-[#176b4d]" />
					Private CR
				</label>
				<label class="flex h-9 items-center gap-2 rounded-full border border-[#dde3dc] bg-white px-3 text-sm">
					<input type="checkbox" bind:checked={wifi} class="accent-[#176b4d]" />
					Wi-Fi
				</label>
				<label class="flex h-9 items-center gap-2 rounded-full border border-[#dde3dc] bg-white px-3 text-sm">
					<input type="checkbox" bind:checked={water} class="accent-[#176b4d]" />
					Water included
				</label>
				<label class="flex h-9 items-center gap-2 rounded-full border border-[#dde3dc] bg-white px-3 text-sm">
					<input type="checkbox" bind:checked={electricity} class="accent-[#176b4d]" />
					Power included
				</label>
			</div>
			<div class="flex items-center gap-2 text-sm text-[#68766e]">
				<span>Per room</span>
				<div class="flex h-9 items-center overflow-hidden rounded-lg border border-[#dde3dc] bg-white">
					<button
						type="button"
						class="flex size-9 items-center justify-center border-r border-[#dde3dc] text-[#68766e] hover:bg-[#f3f5f2] disabled:cursor-not-allowed disabled:opacity-40"
						disabled={perRoom <= 1}
						onclick={() => perRoom = Math.max(1, perRoom - 1)}
						aria-label="Decrease people per room"
					>
						<Minus class="size-4" />
					</button>
					<input
						value={perRoom}
						oninput={(event) => perRoom = Math.min(10, Math.max(1, Number(event.currentTarget.value) || 1))}
						aria-label="People per room"
						class="h-full w-14 appearance-none border-0 bg-white text-center text-sm font-bold text-[#18231d] outline-none"
					/>
					<button
						type="button"
						class="flex size-9 items-center justify-center border-l border-[#dde3dc] text-[#68766e] hover:bg-[#f3f5f2] disabled:cursor-not-allowed disabled:opacity-40"
						disabled={perRoom >= 10}
						onclick={() => perRoom = Math.min(10, perRoom + 1)}
						aria-label="Increase people per room"
					>
						<Plus class="size-4" />
					</button>
				</div>
			</div>
		</div>

		<div class="mb-5 flex items-end justify-between">
			<div>
				<h2 class="text-xl font-black">Available listings</h2>
				<p class="mt-1 text-sm text-[#718078]">{filtered.length} spaces found</p>
			</div>
			<select class="h-9 rounded-lg border border-[#dde3dc] bg-white px-3 text-sm font-semibold outline-none">
				<option>Recommended</option>
				<option>Lowest rent</option>
				<option>Highest rated</option>
			</select>
		</div>

		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filtered.slice(0, visibleCount) as listing (listing.id)}
				<Card.Root class="group gap-0 rounded-2xl border-0 py-0 shadow-[0_5px_20px_rgba(42,70,54,0.08)] ring-1 ring-[#dde3dc] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(42,70,54,0.14)]">
					<div class="relative overflow-hidden rounded-t-2xl">
						<img src={listing.image} alt={listing.name} class="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
						{#if listing.verified}
							<Badge class="absolute left-3 top-3 bg-white text-[#176b4d] shadow-sm">Verified</Badge>
						{/if}
						<button
							class="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white shadow-md"
							onclick={() => toggleSaved(listing.id)}
							aria-label={saved.includes(listing.id) ? 'Remove from saved' : 'Save listing'}
						>
							<Heart class={`size-4 ${saved.includes(listing.id) ? 'fill-[#ef7d57] text-[#ef7d57]' : 'text-[#68766e]'}`} />
						</button>
					</div>
					<Card.Content class="gap-3 p-4">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0">
								<h3 class="truncate font-black">{listing.name}</h3>
								<p class="mt-1 flex items-center gap-1 text-xs text-[#718078]"><MapPin class="size-3" /> {listing.location}</p>
							</div>
							<div class="flex shrink-0 items-center gap-1 text-xs font-bold"><Star class="size-3 fill-[#f5b94c] text-[#f5b94c]" /> {listing.rating}</div>
						</div>
						<div class="flex items-center gap-3 rounded-lg bg-[#f1f5f1] px-3 py-2 text-xs text-[#526158]">
							<div class="flex items-center gap-1.5">
								<MapPin class="size-3.5 text-[#176b4d]" />
								<span>{routeDetails[listing.location]?.distance ?? 'Calculating'} from UP Diliman</span>
							</div>
							<span class="h-4 w-px bg-[#d7dfd8]"></span>
							<div class="flex items-center gap-1.5">
								<Clock class="size-3.5 text-[#176b4d]" />
								<span>{routeDetails[listing.location]?.duration ?? '...'}</span>
							</div>
						</div>
						<div class="flex items-baseline gap-1 border-y border-[#edf0ec] py-3">
							<span class="text-xl font-black text-[#176b4d]">₱{listing.rent.toLocaleString()}</span>
							<span class="text-xs text-[#718078]">/ month</span>
						</div>
						<div class="grid grid-cols-2 gap-2 text-xs text-[#4f5e55]">
							<span class="flex items-center gap-1.5"><Users class="size-3.5" /> {listing.perRoom} per room</span>
							<span class={`flex items-center gap-1.5 ${listing.privateCR ? '' : 'text-[#9ba49f]'}`}><Bath class="size-3.5" /> {listing.privateCR ? 'Private CR' : 'Shared CR'}</span>
							<span class={`flex items-center gap-1.5 ${listing.wifi ? '' : 'text-[#9ba49f]'}`}><Wifi class="size-3.5" /> Wi-Fi {listing.wifi ? 'inc.' : 'extra'}</span>
							<span class={`flex items-center gap-1.5 ${listing.water && listing.electricity ? '' : 'text-[#9ba49f]'}`}><Droplets class="size-3.5" /><Bolt class="-ml-2 size-3.5" /> Utilities</span>
						</div>
						<Button href={`/chat/${listing.id}`} variant="outline" class="mt-1 h-9 w-full rounded-lg border-[#b9cfc2] font-bold text-[#176b4d] hover:bg-[#edf3ef]">
							Contact seller
						</Button>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		{#if visibleCount < filtered.length}
			<div class="mt-8 text-center">
				<Button variant="outline" class="h-10 rounded-lg px-6 font-bold" onclick={() => visibleCount += 24}>Load more listings</Button>
			</div>
		{/if}
	</section>
</main>
