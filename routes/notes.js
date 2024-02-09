const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//......................................Route 1......................................................

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
     //This line means, jo user req.user ke equal ho usse find krlo
    const notes = await Note.find({
      user: req.user.id,
    });
    res.json(notes);    // this means notes array send krdo reponse
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//--------------------------------Route 2: To add notes---------------------
//-------------Add a new note using Post request: "localhost:5000/api/notes/addnote"-----------------------
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("price", "Enter a valid price").isLength({ min: 1 }),
    body("color", "Enter a valid color").isLength({ min: 3 }),
    body("size", "Enter a valid size").isLength({ min: 1 }),
   
  ],
  async (req, res) => {
    try {
        //Extract title, description, tag from req.body by using object destruction
      const { title, description , price, color, size} = req.body;

      //If there is any error occured, return end request and the validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const note = new Note({
        title,
        description,
        price,
        color,
        size,
        user: req.user.id,
      });
      const savedNotes = await note.save();

      res.json(
        savedNotes
        );
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);


//-------------Route 3 : update and existing note---------------
//------------"localhost:5000/api/notes/updatenote/:id"-------------------------
router.put(
    "/updatenote/:id",
    fetchuser,
    async (req, res) => {
      try {
        //Extract title, description, tag from req.body by using object destruction
        const { title, description, price, color, size  } = req.body;
        //Yeh line ek naya empty object newNote banata hai, jisme hum update karne wale note ki nayi values store karenge.
        const newNote = {};

        //agar title hai to newNote ke title ko title kardo,

        if(title){newNote.title = title}; // Yeh line check karta hai ki title exist karta hai ya nahi. Agar hai, toh newNote object mein title property set karta hai.
        if(description){newNote.description = description};
        if(price){newNote.price = price};
        if(color){newNote.color = color};
        if(size){newNote.size = size};

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);   //params me jo id hai 
        if (!note){    //agar params me id nahi hai to..
            return res.status(404).send("Not Found")
        }

        //Allow update only id user owns this Note
        if (note.user.toString() !== req.user.id){    //agar params me id nahi hai to..
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            {$set: newNote},
            {new:true}
        )
        res.json({note});
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  );


  //----------------------Route 3-----------------------
  //-----this route 3 is to delete the note : "localhost:5000/api/notes/deletenote/:id"
  router.delete(
    "/deletenote/:id",
    fetchuser,
    async (req, res) => {
      try {
        //Extract title, description, tag from req.body by using object destruction
        const { title, description, tag } = req.body;;

        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);   //params me jo id hai 
        if (!note){    //agar params me id nahi hai to..
            return res.status(404).send("Not Found")
        }

        //Allow deletion only id user owns this Note
        if (note.user.toString() !== req.user.id){    //agar params me id nahi hai to..
            return res.status(401).send("Not Allowed")
        }


        note = await Note.findByIdAndDelete(
            req.params.id,
        )

        res.json({
          "Sucess" : "Note has been deleted",
          note: note
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  );


  // -------------------------Route 3 : Search------------------------
  // /fetchallSearchednotes?title=your_title
  router.get("/fetchallSearchednotes", fetchuser, async (req, res) => {
    try {
      const searchTitle = req.query.title || ""; // Get the search title from query parameters or set an empty string as default
  
      const notes = await Note.find({
        user: req.user.id, // Ensure correct user association using `req.user.id`
        title: { $regex: new RegExp(searchTitle, "i") }, // Perform case-insensitive search with exact match
      });
  
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

//  ---------------Route 4: Search and Sort--------------
//    //SearchAndSort?sort=asc
//    //SearchAndSort?sort=desc
//    //SearchAndSort?title=Jeans&sort=asc
//    //SearchAndSort?title=Jeans&sort=desc

router.get("/SearchAndSort", fetchuser, async (req, res) => {
  try {
    // Extract the title and sort parameters from the query string
    const { title, sort } = req.query;

    // Build the filter object based on the title parameter
    const filter = { user: req.user.id };
    if (title) {
      filter.title = title;
    }

    // Build the sort object based on the sort parameter
    let sortOption = {};
    if (sort === "asc") {
      sortOption = { price: 1 }; // Ascending order
    } else if (sort === "desc") {
      sortOption = { price: -1 }; // Descending order
    }

    // Use the filter and sort objects in the Note.find method
    const notes = await Note.find(filter).sort(sortOption);

    // Send the filtered and sorted notes array as a JSON response
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
