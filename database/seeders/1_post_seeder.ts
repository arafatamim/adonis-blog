import Post from "#models/post";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class extends BaseSeeder {
  static environment = ["development"];

  async run() {
    await Post.createMany([
      {
        id: 1,
        title: "Example post",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id metus ut enim ultricies bibendum rutrum at turpis. Nulla quis eros et leo lobortis rhoncus. Nulla imperdiet erat sed varius pharetra. Nullam eget enim eu lectus vestibulum tincidunt id at orci. In auctor venenatis dolor, id rutrum quam egestas et. Morbi semper, nibh ac ullamcorper feugiat, eros elit imperdiet lectus, eget mattis metus dui vel tellus. Fusce luctus, eros nec ultricies egestas, ante nisl tincidunt odio, congue iaculis leo justo ac orci. Vestibulum eget orci sed diam luctus euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mi enim, aliquam at dui sodales, fringilla congue neque.`,
        slug: "example-post",
        userId: 1,
        published: true,
      },
      {
        id: 2,
        title: "Another example draft post",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id metus ut enim ultricies bibendum rutrum at turpis. Nulla quis eros et leo lobortis rhoncus. Nulla imperdiet erat sed varius pharetra. Nullam eget enim eu lectus vestibulum tincidunt id at orci. In auctor venenatis dolor, id rutrum quam egestas et. Morbi semper, nibh ac ullamcorper feugiat, eros elit imperdiet lectus, eget mattis metus dui vel tellus. Fusce luctus, eros nec ultricies egestas, ante nisl tincidunt odio, congue iaculis leo justo ac orci. Vestibulum eget orci sed diam luctus euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mi enim, aliquam at dui sodales, fringilla congue neque.`,
        slug: "another-example-draft-post",
        userId: 1,
        published: false,
      },
    ]);
  }
}
