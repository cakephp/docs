5.1.1 Understanding How ACL Works
---------------------------------

Powerful things require access control. Access control lists are a
way to manage application permissions in a fine-grained, yet easily
maintainable and manageable way.

Access control lists, or ACL, handle two main things: things that
want stuff, and things that are wanted. In ACL lingo, things (most
often users) that want to use stuff are called access request
objects, or AROs. Things in the system that are wanted (most often
actions or data) are called access control objects, or ACOs. The
entities are called 'objects' because sometimes the requesting
object isn't a person - sometimes you might want to limit the
access certain Cake controllers have to initiate logic in other
parts of your application. ACOs could be anything you want to
control, from a controller action, to a web service, to a line on
your grandma's online diary.

To review:




-  ACO - Access Control Object - Something that is wanted
-  ARO - Access Request Object - Something that wants something

Essentially, ACL is what is used to decide when an ARO can have
access to an ACO.

In order to help you understand how everything works together,
let's use a semi-practical example. Imagine, for a moment, a
computer system used by a familiar group of fantasy novel
adventurers from the *Lord of the Rings*. The leader of the group,
Gandalf, wants to manage the party's assets while maintaining a
healthy amount of privacy and security for the other members of the
party. The first thing he needs to do is create a list of the AROs
involved:


-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

Realize that ACL is *not* the same as authentication. ACL is what
happens *after* a user has been authenticated. Although the two are
usually used in concert, it's important to realize the difference
between knowing who someone is (authentication) and knowing what
they can do (ACL).

The next thing Gandalf needs to do is make an initial list of
things, or ACOs, the system will handle. His list might look
something like:


-  Weapons
-  The One Ring
-  Salted Pork
-  Diplomacy
-  Ale

Traditionally, systems were managed using a sort of matrix, that
showed a basic set of users and permissions relating to objects. If
this information were stored in a table, it might look like the
following table:

Weapons
The Ring
Salted Pork
Diplomacy
Ale
Gandalf
Allow
Allow
Allow
Aragorn
Allow
Allow
Allow
Allow
Bilbo
Allow
Frodo
Allow
Allow
Gollum
Allow
Legolas
Allow
Allow
Allow
Allow
Gimli
Allow
Allow
Pippin
Allow
Allow
Merry
Allow
At first glance, it seems that this sort of system could work
rather well. Assignments can be made to protect security (only
Frodo can access the ring) and protect against accidents (keeping
the hobbits out of the salted pork and weapons). It seems fine
grained enough, and easy enough to read, right?

For a small system like this, maybe a matrix setup would work. But
for a growing system, or a system with a large amount of resources
(ACOs) and users (AROs), a table can become unwieldy rather
quickly. Imagine trying to control access to the hundreds of war
encampments and trying to manage them by unit. Another drawback to
matrices is that you can't really logically group sections of users
or make cascading permissions changes to groups of users based on
those logical groupings. For example, it would sure be nice to
automatically allow the hobbits access to the ale and pork once the
battle is over: Doing it on an individual user basis would be
tedious and error prone. Making a cascading permissions change to
all 'hobbits' would be easy.

ACL is most usually implemented in a tree structure. There is
usually a tree of AROs and a tree of ACOs. By organizing your
objects in trees, permissions can still be dealt out in a granular
fashion, while still maintaining a good grip on the big picture.
Being the wise leader he is, Gandalf elects to use ACL in his new
system, and organizes his objects along the following lines:


-  Fellowship of the Ring™
   
   -  Warriors
      
      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards
      
      -  Gandalf

   -  Hobbits
      
      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors
      
      -  Gollum



Using a tree structure for AROs allows Gandalf to define
permissions that apply to entire groups of users at once. So, using
our ARO tree, Gandalf can tack on a few group-based permissions:


-  Fellowship of the Ring
   (**Deny**: all)
   
   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)
      
      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)
      
      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)
      
      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors
      (**Allow**: Salted Pork)
      
      -  Gollum



If we wanted to use ACL to see if the Pippin was allowed to access
the ale, we'd first get his path in the tree, which is
Fellowship->Hobbits->Pippin. Then we see the different permissions
that reside at each of those points, and use the most specific
permission relating to Pippin and the Ale.

ARO Node
Permission Info
Result
Fellowship of the Ring
Deny all
Denying access to ale.
Hobbits
Allow 'ale'
Allowing access to ale!
Pippin
--
Still allowing ale!
Since the 'Pippin' node in the ACL tree doesn't specifically deny
access to the ale ACO, the final result is that we allow access to
that ACO.

The tree also allows us to make finer adjustments for more granular
control - while still keeping the ability to make sweeping changes
to groups of AROs:


-  Fellowship of the Ring
   (**Deny**: all)
   
   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)
      
      -  Aragorn
         (Allow: Diplomacy)
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)
      
      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)
      
      -  Frodo
         (Allow: Ring)
      -  Bilbo
      -  Merry
         (Deny: Ale)
      -  Pippin
         (Allow: Diplomacy)

   -  Visitors
      (**Allow**: Salted Pork)
      
      -  Gollum



This approach allows us both the ability to make wide-reaching
permissions changes, but also fine-grained adjustments. This allows
us to say that all hobbits can have access to ale, with one
exception—Merry. To see if Merry can access the Ale, we'd find his
path in the tree: Fellowship->Hobbits->Merry and work our way down,
keeping track of ale-related permissions:

ARO Node
Permission Info
Result
Fellowship of the Ring
Deny all
Denying access to ale.
Hobbits
Allow 'ale'
Allowing access to ale!
Merry
Deny 'ale'
Denying ale.
