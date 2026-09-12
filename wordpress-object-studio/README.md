# Donghao / Objects

A custom WordPress portfolio for a small 3D studio, built around three original Blender studies.

[Open the interactive WordPress demo](https://playground.wordpress.net/?blueprint-url=https%3A%2F%2Fraw.githubusercontent.com%2Falidonghao118-commits%2Fwork-samples%2Fmain%2Fwordpress-object-studio%2Fblueprint.json)

Give WordPress a moment to start. The demo runs in your browser. Use sample details in the inquiry form; this is a portfolio demonstration, not a live order form. Each visitor gets their own sandbox, including access to its WordPress admin.

## Try it

1. Filter **Selected objects** by Product or Game props.
2. Open an object to view its individual project page.
3. Submit a sample inquiry.
4. Open `/wp-admin/` inside the demo and choose **Demo inquiries** to see the saved private entry. **Projects** and **Project categories** contain the editable portfolio content.

## Built with

WordPress 7.1, PHP 8.3, an original PHP/CSS theme, custom post types and taxonomy, and WordPress Playground. No page builder or paid plugin is required. The form uses WordPress nonces, server-side validation, a honeypot and a short submission cooldown. It saves demo inquiries to the database; it does not send email.

The local version was checked through a real browser and database queries. Invalid nonce, email, service, short brief and honeypot requests were rejected without creating records. A valid browser submission was saved privately and appeared in the admin. Desktop and mobile layouts were inspected.

## Source and reuse

`object-studio-theme.zip` contains the editable PHP/CSS theme and demonstration images. `blueprint.json` seeds the original portfolio examples and launches the sandbox. No customer work, live inquiries or account data is included.

Theme code: GPL-2.0-or-later. Original renders remain Donghao's portfolio artwork; included for demonstration, not separately licensed stock assets. WordPress and Playground retain their own licenses.
