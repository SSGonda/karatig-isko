<script lang="ts">
	import { page } from '$app/state';
	import { listings } from '#lib/data/listings.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import {
		ArrowLeft,
		Bath,
		Bolt,
		Droplets,
		ExternalLink,
		Heart,
		MapPin,
		Star,
		Users,
		Wifi
	} from '@lucide/svelte';

	let listingId = $derived(Number(page.params.id));
	let listing = $derived(listings.find((item) => item.id === listingId) ?? listings[0]);
	let saved = $state(false);
	let selectedImage = $state('');

	$effect(() => {
		selectedImage = listing.images[0];
	});
</script>

<main class="mx-auto max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
	<a
		href="/"
		class="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#68766e] hover:text-[#176b4d]"
	>
		<ArrowLeft class="size-4" />
		Back to listings
	</a>

	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
		<section class="min-w-0">
			<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
				<div
					class="relative order-1 aspect-[16/9] overflow-hidden rounded-2xl bg-[#edf3ef] sm:order-0"
				>
					<img
						src={selectedImage || listing.image}
						alt={listing.name}
						class="absolute inset-0 h-full w-full object-cover"
					/>
					{#if listing.verified}
						<Badge class="absolute top-4 left-4 bg-white text-[#176b4d] shadow-sm">Verified</Badge>
					{/if}
					<button
						type="button"
						class="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white shadow-md"
						onclick={() => (saved = !saved)}
						aria-label={saved ? 'Remove from saved' : 'Save listing'}
					>
						<Heart class={`size-5 ${saved ? 'fill-[#ef7d57] text-[#ef7d57]' : 'text-[#68766e]'}`} />
					</button>
				</div>
				<div
					class="order-0 grid grid-cols-4 gap-2 sm:order-1 sm:h-full sm:grid-cols-1 sm:grid-rows-4 sm:gap-3"
				>
					{#each listing.images as image, index}
						<button
							type="button"
							class={`h-20 overflow-hidden rounded-xl border-2 bg-[#edf3ef] transition sm:h-full ${
								(selectedImage || listing.image) === image
									? 'border-[#176b4d]'
									: 'border-transparent hover:border-[#b9cfc2]'
							}`}
							onclick={() => (selectedImage = image)}
							aria-label={`View photo ${index + 1} of ${listing.name}`}
						>
							<img
								src={image}
								alt={`${listing.name} photo ${index + 1}`}
								class="h-20 w-full object-cover sm:h-full"
							/>
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-6 rounded-2xl border border-[#dde3dc] bg-white p-5 sm:p-6">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 class="text-2xl font-black text-[#18231d] sm:text-3xl">{listing.name}</h1>
						<p class="mt-2 flex items-center gap-1.5 text-sm text-[#718078]">
							<MapPin class="size-4" />
							{listing.location}
						</p>
					</div>
					<div class="flex items-center gap-1.5 text-sm font-bold">
						<Star class="size-4 fill-[#f5b94c] text-[#f5b94c]" />
						{listing.rating}
						<span class="font-normal text-[#718078]">({listing.reviews} reviews)</span>
					</div>
				</div>

				<p class="mt-5 text-sm leading-6 text-[#68766e]">{listing.description}</p>

				<h2 class="mt-6 text-lg font-black">Amenities</h2>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					<div class="flex items-center gap-2 rounded-lg bg-[#f3f5f2] p-3 text-sm">
						<Users class="size-4 text-[#176b4d]" />
						{listing.perRoom} per room
					</div>
					<div class="flex items-center gap-2 rounded-lg bg-[#f3f5f2] p-3 text-sm">
						<Bath class="size-4 text-[#176b4d]" />
						{listing.privateCR ? 'Private CR' : 'Shared CR'}
					</div>
					<div
						class={`flex items-center gap-2 rounded-lg bg-[#f3f5f2] p-3 text-sm ${listing.wifi ? '' : 'text-[#9ba49f]'}`}
					>
						<Wifi class="size-4" />
						Wi-Fi {listing.wifi ? 'included' : 'not included'}
					</div>
					<div
						class={`flex items-center gap-2 rounded-lg bg-[#f3f5f2] p-3 text-sm ${listing.water && listing.electricity ? '' : 'text-[#9ba49f]'}`}
					>
						<Droplets class="size-4" />
						<Bolt class="-ml-1 size-4" />
						Utilities {listing.water && listing.electricity ? 'included' : 'partially included'}
					</div>
				</div>
			</div>
		</section>

		<aside class="h-fit rounded-2xl border border-[#dde3dc] bg-white p-5 lg:sticky lg:top-20">
			<div class="flex items-baseline gap-1 border-b border-[#edf0ec] pb-4">
				<span class="text-2xl font-black text-[#176b4d]">
					₱{listing.rent.toLocaleString()}
				</span>
				<span class="text-sm text-[#718078]">/ month</span>
			</div>
			<div class="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div class="rounded-lg bg-[#f3f5f2] p-3">
					<p class="text-xs text-[#718078]">Area</p>
					<p class="mt-1 font-black">{listing.area}</p>
				</div>
				<div class="rounded-lg bg-[#f3f5f2] p-3">
					<p class="text-xs text-[#718078]">Available for</p>
					<p class="mt-1 font-black">
						{listing.gender === 'Any'
							? 'All genders'
							: listing.gender === 'Male'
								? 'Male'
								: 'Female'}
					</p>
				</div>
			</div>
			<div class="mt-4 rounded-lg border border-[#dde3dc] p-3">
				<p class="text-xs text-[#718078]">Availability</p>
				<p class="mt-1 text-sm font-black">{listing.available}</p>
			</div>
			<div class="mt-2 grid grid-cols-2 gap-2 text-sm">
				<div class="rounded-lg bg-[#f3f5f2] p-3">
					<p class="text-xs text-[#718078]">Minimum stay</p>
					<p class="mt-1 font-black">{listing.minimumStayMonths} months</p>
				</div>
				<div class="rounded-lg bg-[#f3f5f2] p-3">
					<p class="text-xs text-[#718078]">Maximum stay</p>
					<p class="mt-1 font-black">{listing.maximumStayMonths} months</p>
				</div>
			</div>
			<p class="mt-4 text-sm text-[#68766e]">
				Listed by <span class="font-bold text-[#18231d]">{listing.seller}</span>
			</p>
			<Button
				href={`/chat/${listing.id}`}
				class="mt-5 h-11 w-full rounded-lg bg-[#176b4d] font-bold"
			>
				Contact seller
			</Button>
			<Button
				href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.name}, ${listing.location}, Quezon City, Philippines`)}`}
				target="_blank"
				rel="noopener noreferrer"
				variant="outline"
				class="mt-2 h-11 w-full rounded-lg border-[#b9cfc2] font-bold text-[#176b4d]"
			>
				<MapPin class="size-4" />
				View on Maps
				<ExternalLink class="size-3.5" />
			</Button>
		</aside>
	</div>
</main>
