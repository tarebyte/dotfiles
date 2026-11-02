---
name: sandi-metz-rules
description: Apply Sandi Metz' four rules (classes of 100 lines or fewer, methods of 5 lines or fewer, 4 parameters or fewer, one object per controller action) to Ruby code that you write or change. Use this skill whenever you write, edit, or refactor Ruby — Rails models, controllers, views, services, jobs, libraries, scripts, or tests — even when the user does not mention style, design, or Sandi Metz. The rules cover new and changed code only; this skill does not ask for broad refactors of existing code.
---

# Sandi Metz' rules for Ruby

These rules push code toward small objects with one responsibility and small methods with good names. A well-named private method is documentation: the reader learns *what* happens from the name and only reads *how* when they need to. Follow the intent, not just the count. Code that passes the count by cramming logic onto one line misses the point.

## The rules

1. **Classes have 100 lines of code or fewer.**
2. **Methods have 5 lines of code or fewer.**
3. **Methods take 4 parameters or fewer.** Hash options are parameters.
4. **A controller action gives the view one object.** The view knows about one instance variable and sends messages only to that object (`@object.collaborator.value` is not allowed).

**Rule zero:** Break a rule only when you have a good reason. The user is your pair. When you break a rule, say which rule and why in your summary (see "Report exceptions" below). Do not stop to ask first.

## Scope: new and changed code only

Many existing Ruby codebases have classes with thousands of lines. Rewriting them is not your job unless the user asks. Keep diffs focused.

- **New classes and new methods:** follow all four rules.
- **Changing an existing method that is already too long:** do not make it longer when you can avoid it. Put the new logic in a new, well-named private method and call it. Do not restructure the rest of the method.
- **Adding to an existing class that is already too long:** adding a method is fine. If the new behavior is a separate responsibility, put it in a new class and have the existing class delegate to it. Do not split the existing class.
- **Code you are not changing:** leave it alone, even if it breaks the rules.

## How to count

**Method lines** are the lines between `def` and its `end`. Do not count the `def` line, the `end` line, blank lines, comments, or Sorbet `sig` blocks. Do count `if`, `elsif`, `else`, `end`, `rescue`, `ensure`, and every physical line of a multi-line expression. With five lines, an `if`/`else` has room for one line per branch:

```ruby
def validate_actor
  if actor_type == "Group"
    user_must_belong_to_group
  elsif actor_type == "User"
    user_must_be_the_same_as_actor
  end
end
```

Do not game the count. Semicolons, nested ternaries, ternaries inside expressions, parallel or chained assignments (`a, b = x, y`; `a = b[:k] = c`), `and`/`or` control flow, sentinel return values (`nil` meaning one case, `[]` another), and very long chained lines make code harder to read. If logic does not fit, extract it when the extracted piece has a clear name; otherwise keep it and report an exception.

**Class lines** are lines of code between `class` and its `end`, without blank lines and comments. Private methods count.

**Parameters:** every positional, optional, keyword, and splat parameter counts as one. A block parameter does not count. An options hash counts as one parameter per key that the method reads. A hash does not hide parameters.

**Controller objects:** count every instance variable that the view can see, including instance variables set in `before_action` callbacks. Instance variables that only memoize controller internals do not count; prefix them with an underscore (`@_current_plan ||= ...`) to show that the view must not use them.

## Techniques

Use these to stay within the rules:

- **Extract a private method.** Name it for what it does, not how. `eligible_for_discount?` is better than `check_tier_and_total`.
- **Extract a class** when a group of methods shares data that the rest of the class does not use. That group is a separate responsibility.
- **Introduce a parameter object** when several parameters always travel together. `Data.define`, `Struct`, or a small class works.
- **Replace a conditional with a lookup or polymorphism** when branches multiply. A hash of strategies, or one class per case, keeps each method short.
- **Use a facade for controllers.** When a page needs several things, build one object that gives access to all of them:

  ```ruby
  class Dashboard
    def initialize(user)
      @user = user
    end

    def statuses
      Status.for(user)
    end

    def notifications
      @notifications ||= user.notifications
    end

    private

    attr_reader :user
  end

  class DashboardsController < ApplicationController
    def show
      @dashboard = Dashboard.new(current_user)
    end
  end
  ```

  The view then passes parts of `@dashboard` to partials or components: `render "statuses", statuses: @dashboard.statuses`. If the codebase already uses view models, presenters, or ViewComponent, use that pattern instead of inventing a `facades/` directory.

Do not over-extract. A chain of tiny methods with vague names (`step_one`, `do_work`, `helper`) is worse than one clear six-line method. Every extracted method needs a name that a reader understands without opening it.

The same applies to classes. Do not move part of a class into a module or mixin only to get under 100 lines. A module that works with only one class (for example, one that needs `requires_ancestor` to type-check) is still that class, split across two files. Keep a pattern's parts together: a Template Method's hook methods belong on the base class, where a reader looks for them. Extract a class only when the group of methods has its own responsibility and a name.

## Common reasons to break a rule

These are good reasons under rule zero. They still go in the exception report, except where noted.

- **Framework calls with many arguments**, for example `link_to`, `form_with`, or an ActiveRecord `has_many` with several options, when wrapping them adds nothing.
- **A method that must match an external signature**, for example a callback, an interface, or a public API that callers already use.
- **Database migrations.** A `change` method lists the schema changes in order. Splitting it makes it harder to read.
- **A design pattern's central class**, such as a Template Method base class with its hooks, when splitting it would scatter the pattern across files.
- **Test method bodies.** Tests read best as arrange, act, assert in one place. You do not need to report long test bodies. Keep them focused: move shared setup to `setup`, fixtures, factories, or helpers. New test files still follow the 100-line class rule: split a large test file by feature.

If the project's linter (for example RuboCop) conflicts with these rules, the project's linter wins.

## Check your work

After you change Ruby files, run the bundled checker from the repository root. The script is in this skill's directory:

```bash
ruby <skill-dir>/scripts/check_rules.rb --changed
```

`--changed` compares the working tree with the merge base of the default branch and checks only changed `.rb` files. Use `--base REF` to compare with a different ref. To check whole files instead, pass file paths without `--changed`.

The checker labels each finding:

- **NEW**: the class or method definition line is new or changed. Fix it, or report it as an exception.
- **EXISTING**: you changed lines inside an existing class or method that already breaks a rule. Make sure that you did not make it worse. You do not need to fix it.

The checker cannot count options-hash keys, cannot see `before_action` instance variables in other methods, and does not check views. Check those by reading the code.

## Report exceptions

At the end of your summary to the user, add a short section for every rule that your new or changed code breaks:

```
Sandi Metz rule exceptions:
- app/models/order.rb:42 `Order#to_csv_row` — 7 lines (rule 2). It maps 7 CSV columns in order; splitting it hides the column order.
```

If there are no exceptions, write one line: `Sandi Metz rules: no exceptions.`
