# One More Chair

Original portfolio sample — incremental slice-of-life narrative.

You are 23, unpacking your first flat. Small domestic improvements make room for a friendship across the landing.

## Player-facing events

### 1. The folded menu

Your kitchen table rocks when you butter toast. Under one leg, the previous tenant has left a takeaway menu folded into a brick.

You borrow an Allen key from June across the landing. She tips a biscuit tin onto her doormat: screws, batteries, one actual biscuit.

“Emergency supply,” she says, putting it back.

One loose bolt. That's all. The menu comes out; your tea stays still.

For the first time since moving in, you put something down without finding somewhere else for it first.

### 2. Enough for two

You return the key with a container of lentil soup. June checks the lid.

“This one's yours. I keep accidentally adopting these.”

Next time, the container comes back washed, with a lemon inside. After that, you find yourself cutting two wedges before you sit down.

Tonight she catches you on the landing.

“Was there a recipe?”

“There was half an onion that needed using.”

“Write that bit down, then.”

### 3. The spare chair

June brings her desk chair to dinner. It has wheels. On your sloping kitchen floor, it gradually carries her away from the table.

“Lovely food,” she says, rolling backwards. “Terrible service.”

You wedge a folded tea towel under one wheel.

She stays for the washing-up. You dry the bowls; she tests the table with both hands.

“Solid.”

You hadn't realised you were waiting for her to notice.

### Choice: What happens next?

**“Shall we make Thursdays dinner night?”**

June checks her phone. “Except next Thursday. Dentist.” You write DINNER on the following week. She adds BRING A PROPER CHAIR.

**“Come over when you smell something good.”**

“And if I smell burning?”

“Bring the emergency biscuit.”

She spots the soup container on your shelf. “Save me some when there's extra.”

## Implementation notes

- **Event 1:** Unlock after unpacking the kitchen and choosing to inspect the wobble. Borrowing the key and tightening the bolt complete one short interaction; no purchase or repeated repair actions. Set `table_repaired`.
- **Event 2:** Require `table_repaired` and preparing soup. Choosing “Return the key with soup” triggers the first exchange. Spread the container return and later conversation across the next two distinct cooking sessions, at most one relationship beat per in-game day. No real-time waiting requirement.
- **Event 3:** After the later conversation, unlock “Invite June for dinner.” The player chooses an evening for the invitation; ingredients already available cover the meal. Trigger once, then present the choice.
- **Outcomes:** Both choices establish friendship and unlock shared meals. Thursday dinners create an editable calendar reminder; spontaneous dinners create an optional invitation during cooking. Equal relationship progress and rewards. Skipping, postponing, or changing the arrangement costs nothing; June's availability is communicated before ingredients are used.
