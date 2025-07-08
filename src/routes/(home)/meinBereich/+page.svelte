<script>
	import { settingsStore } from '$lib/stores/settings';
	import { downloadBackup } from '$lib/backupFunctions/downloadBackup';
	import { handleUploadBackup } from '$lib/backupFunctions/uploadBackup';
</script>

<div class="mx-auto mt-10 max-w-4xl rounded-lg bg-stone-500/50 px-6 py-12">
	<h1 class="mb-8 px-2 text-3xl font-bold">Mein Bereich</h1>

	<div class="flex flex-col gap-4 text-lg *:border-b">
		<div class="gap-2 py-2">
			<div class="px-2 text-base text-stone-900">
				Lege fest, welchen Gesamtzähler du für dein Sammelheft verwenden möchtest. (Basic Karten
				sind dabei Gold, Silber und Bronze)
			</div>
			<label class="my-2 flex cursor-pointer items-center gap-2 pl-8 font-bold">
				<span>Ohne Basic Karten</span>
				<input
					type="checkbox"
					value=""
					class="peer sr-only"
					bind:checked={$settingsStore.globalCounterWithBaseCards}
				/>
				<div
					class="peer relative h-6 w-11 rounded-full bg-amber-500 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
				></div>

				<span>Mit Basic Karten</span>
			</label>
		</div>
		<div class="gap-2 py-2">
			<div class="text-2xl font-black text-stone-900">Sammelheft sichern</div>
			<div class="px-2 text-base text-stone-900">
				Hier kannst du dir eine Sicherungskopie herunterladen und lokal Speichern:
			</div>
			<div class="pl-8">
				<button
					on:click={downloadBackup}
					class="mt-2 flex cursor-pointer items-center gap-2 rounded-md bg-amber-500/70 px-4 py-2 font-bold text-stone-900 hover:bg-amber-600"
				>
					Sicherungskopie herunterladen

					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M18 20.289L21.288 17l-.688-.688l-2.1 2.1v-4.887h-1v4.887l-2.1-2.1l-.688.688zM14.5 23.5v-1h7v1zm-8.384-4q-.652 0-1.134-.482T4.5 17.884V4.116q0-.652.482-1.134T6.116 2.5H13L18.5 8v3.14h-1V8.5h-5v-5H6.116q-.231 0-.424.192t-.192.423v13.77q0 .23.192.423t.423.192h6v1zm-.616-1v-15z"
							stroke-width="0.7"
							stroke="currentColor"
						/></svg
					>
				</button>
			</div>
			<div class="mt-4 border-t border-dashed px-2 pt-2 text-base text-stone-900">
				Hier kannst du deine Sicherungkopie hochladen:
			</div>
			<div class="mb-4 pl-8">
				<div class="text-sm text-stone-900">
					<span class="font-bold">Achtung:</span> Beim Hochladen wird dein aktuelles Sammelheft überschrieben!
				</div>
				<div class="mt-2">
					
					<input
						class="block w-full cursor-pointer rounded-lg border-2 border-amber-500/70 px-2 py-1 bg-white "
						aria-describedby="file_input_help"
						accept="application/json"
						type="file"
                        on:change={handleUploadBackup}
					/>
					<p class="mt-1 text-xs text-stone-900" id="file_input_help">
						Nur json-Dateien sind erlaubt. Die Datei muss das Format
                        <code class="font-bold text-black">fut-sammelheft_backup_YYYY-MM-DD_HH-MM-SS.json</code> haben.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
